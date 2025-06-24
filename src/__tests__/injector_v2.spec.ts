import injectorV2 from '../ops/injector_v2'

const gemfile = `
    source 'http://rubygems.org'
    gem 'rails'
    gem 'nokogiri'
    gem 'httparty'

    `

const configFile = `
config:
  database: mysql
  cache: redis
  logging: true
`

const packageJson = `{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.0.0"
  }
}`

describe('injectorV2', () => {
  describe('location-based injection', () => {
    it('before rails', () => {
      expect(
        injectorV2(
          {
            attributes: {
              before: "gem 'rails'",
            },
            body: "    gem 'kamikaze' # added by hygen",
          },
          gemfile,
        ),
      ).toMatchSnapshot()
    })

    it('after rails', () => {
      expect(
        injectorV2(
          {
            attributes: {
              after: "gem 'rails'",
            },
            body: "    gem 'kamikaze' # added by hygen",
          },
          gemfile,
        ),
      ).toMatchSnapshot()
    })

    it('prepend top of file', () => {
      expect(
        injectorV2(
          {
            attributes: {
              prepend: true,
            },
            body: "    gem 'kamikaze' # added by hygen",
          },
          gemfile,
        ),
      ).toMatchSnapshot()
    })

    it('append bottom of file', () => {
      expect(
        injectorV2(
          {
            attributes: {
              append: true,
            },
            body: "    gem 'kamikaze' # added by hygen",
          },
          gemfile,
        ),
      ).toMatchSnapshot()
    })

    it('at_line 2 (below "source")', () => {
      expect(
        injectorV2(
          {
            attributes: {
              at_line: 2,
            },
            body: "    gem 'kamikaze' # added by hygen",
          },
          gemfile,
        ),
      ).toMatchSnapshot()
    })

    it('returns original content when no valid location attribute found', () => {
      expect(
        injectorV2(
          {
            attributes: {},
            body: "    gem 'kamikaze' # added by hygen",
          },
          gemfile,
        ),
      ).toBe(gemfile)
    })

    it('returns original content when pattern not found', () => {
      expect(
        injectorV2(
          {
            attributes: {
              before: 'nonexistent pattern',
            },
            body: "    gem 'kamikaze' # added by hygen",
          },
          gemfile,
        ),
      ).toBe(gemfile)
    })
  })

  describe('skip_if functionality', () => {
    it('skip_if "source" exists', () => {
      expect(
        injectorV2(
          {
            attributes: {
              skip_if: 'source',
              after: "gem 'rails'",
            },
            body: "    gem 'kamikaze' # added by hygen",
          },
          gemfile,
        ),
      ).toMatchSnapshot()
    })

    it('skip_if pattern does not exist - should inject', () => {
      expect(
        injectorV2(
          {
            attributes: {
              skip_if: 'nonexistent',
              after: "gem 'rails'",
            },
            body: "    gem 'kamikaze' # added by hygen",
          },
          gemfile,
        ),
      ).toMatchSnapshot()
    })

    it('correctly interpret multi-line skip_if regex', () => {
      expect(
        injectorV2(
          {
            attributes: {
              skip_if: "rails[a-z\\:\\/\\.'\\s]*giri",
              after: "gem 'rails'",
            },
            body: "    gem 'kamikaze' # added by hygen",
          },
          gemfile,
        ),
      ).toMatchSnapshot()
    })

    it('skip_if with multiline flag works correctly', () => {
      const multilineContent = `line1
line2
line3`
      expect(
        injectorV2(
          {
            attributes: {
              skip_if: '^line2$',
              prepend: true,
            },
            body: 'new line',
          },
          multilineContent,
        ),
      ).toBe(multilineContent) // Should be skipped
    })
  })

  describe('replace functionality', () => {
    it('replaces single occurrence', () => {
      expect(
        injectorV2(
          {
            attributes: {
              replace: 'mysql',
            },
            body: 'postgresql',
          },
          configFile,
        ),
      ).toMatchSnapshot()
    })

    it('replaces multiple occurrences with global flag', () => {
      const content = `
server: mysql
backup: mysql
cache: redis
`
      expect(
        injectorV2(
          {
            attributes: {
              replace: 'mysql',
            },
            body: 'postgresql',
          },
          content,
        ),
      ).toMatchSnapshot()
    })

    it('replaces with regex pattern', () => {
      expect(
        injectorV2(
          {
            attributes: {
              replace: '"react":\\s*"[^"]*"',
            },
            body: '"react": "^19.0.0"',
          },
          packageJson,
        ),
      ).toMatchSnapshot()
    })

    it('returns original content when replace pattern not found', () => {
      expect(
        injectorV2(
          {
            attributes: {
              replace: 'nonexistent',
            },
            body: 'replacement',
          },
          configFile,
        ),
      ).toBe(configFile)
    })

    it('replace takes precedence over location attributes', () => {
      expect(
        injectorV2(
          {
            attributes: {
              replace: 'redis',
              after: 'database',
            },
            body: 'memcached',
          },
          configFile,
        ),
      ).toMatchSnapshot()
    })
  })

  describe('eof_last functionality', () => {
    it('if eof_last is false remove empty line from the end of injection body', () => {
      expect(
        injectorV2(
          {
            attributes: {
              after: "gem 'rails'",
              eof_last: false,
            },
            body: "    gem 'kamikaze' # added by hygen\n",
          },
          gemfile,
        ),
      ).toMatchSnapshot()
    })

    it('if eof_last is true insert empty line to injection body', () => {
      expect(
        injectorV2(
          {
            attributes: {
              after: "gem 'rails'",
              eof_last: true,
            },
            body: "    gem 'kamikaze' # added by hygen",
          },
          gemfile,
        ),
      ).toMatchSnapshot()
    })

    it('if eof_last is false with carriage return', () => {
      expect(
        injectorV2(
          {
            attributes: {
              after: "gem 'rails'",
              eof_last: false,
            },
            body: "    gem 'kamikaze' # added by hygen\r\n",
          },
          gemfile,
        ),
      ).toMatchSnapshot()
    })

    it('body without newline and eof_last true gets newline added', () => {
      expect(
        injectorV2(
          {
            attributes: {
              prepend: true,
              eof_last: true,
            },
            body: '# Header comment',
          },
          gemfile,
        ),
      ).toMatchSnapshot()
    })

    it('body with newline and eof_last undefined preserves newline', () => {
      expect(
        injectorV2(
          {
            attributes: {
              prepend: true,
            },
            body: '# Header comment\n',
          },
          gemfile,
        ),
      ).toMatchSnapshot()
    })
  })

  describe('multi-line pattern matching', () => {
    it('correctly interpret multi-line after regex', () => {
      expect(
        injectorV2(
          {
            attributes: {
              after: "rails[a-z\\:\\/\\.'\\s]*giri",
              eof_last: false,
            },
            body: "    gem 'kamikaze' # added by hygen",
          },
          gemfile,
        ),
      ).toMatchSnapshot()
    })

    it('correctly interpret multi-line before regex', () => {
      expect(
        injectorV2(
          {
            attributes: {
              before: "rails[a-z\\:\\/\\.'\\s]*giri",
              eof_last: false,
            },
            body: "    gem 'kamikaze' # added by hygen",
          },
          gemfile,
        ),
      ).toMatchSnapshot()
    })

    it('handles complex multi-line patterns spanning multiple lines', () => {
      const complexContent = `
function setup() {
  const config = {
    database: 'mysql',
    host: 'localhost'
  };
  return config;
}
`
      expect(
        injectorV2(
          {
            attributes: {
              after: 'config\\s*=\\s*\\{[^}]*\\}',
            },
            body: "  console.log('Setup complete');",
          },
          complexContent,
        ),
      ).toMatchSnapshot()
    })
  })

  describe('newline handling', () => {
    it('preserves Unix line endings', () => {
      const unixContent = 'line1\nline2\nline3\n'
      const result = injectorV2(
        {
          attributes: {
            after: 'line2',
          },
          body: 'inserted',
        },
        unixContent,
      )
      expect(result).toContain('\n')
      expect(result).not.toContain('\r\n')
    })

    it('preserves Windows line endings', () => {
      const windowsContent = 'line1\r\nline2\r\nline3\r\n'
      const result = injectorV2(
        {
          attributes: {
            after: 'line2',
          },
          body: 'inserted',
        },
        windowsContent,
      )
      expect(result).toContain('\r\n')
    })

    it('handles mixed line endings', () => {
      const mixedContent = 'line1\nline2\r\nline3\n'
      const result = injectorV2(
        {
          attributes: {
            after: 'line2',
          },
          body: 'inserted',
        },
        mixedContent,
      )
      // Should detect and use the first line ending style found
      expect(result).toContain('inserted')
    })
  })

  describe('edge cases', () => {
    it('handles empty content', () => {
      expect(
        injectorV2(
          {
            attributes: {
              prepend: true,
            },
            body: 'first line',
          },
          '',
        ),
      ).toMatchSnapshot()
    })

    it('handles empty body', () => {
      expect(
        injectorV2(
          {
            attributes: {
              after: "gem 'rails'",
            },
            body: '',
          },
          gemfile,
        ),
      ).toMatchSnapshot()
    })

    it('handles content with only one line', () => {
      expect(
        injectorV2(
          {
            attributes: {
              append: true,
            },
            body: 'appended',
          },
          'single line',
        ),
      ).toMatchSnapshot()
    })

    it('handles at_line beyond content length', () => {
      expect(
        injectorV2(
          {
            attributes: {
              at_line: 1000,
            },
            body: 'inserted',
          },
          gemfile,
        ),
      ).toMatchSnapshot()
    })

    it('handles negative at_line', () => {
      expect(
        injectorV2(
          {
            attributes: {
              at_line: -1,
            },
            body: 'inserted',
          },
          gemfile,
        ),
      ).toMatchSnapshot()
    })
  })

  describe('attribute precedence', () => {
    it('replace takes precedence over all location attributes', () => {
      expect(
        injectorV2(
          {
            attributes: {
              replace: 'rails',
              before: 'nokogiri',
              after: 'source',
              prepend: true,
              append: true,
              at_line: 1,
            },
            body: 'django',
          },
          gemfile,
        ),
      ).toMatchSnapshot()
    })

    it('skip_if prevents replace operation', () => {
      expect(
        injectorV2(
          {
            attributes: {
              skip_if: 'source',
              replace: 'rails',
            },
            body: 'django',
          },
          gemfile,
        ),
      ).toBe(gemfile) // Should return original content unchanged
    })

    it('at_line takes precedence over other location attributes', () => {
      expect(
        injectorV2(
          {
            attributes: {
              at_line: 3,
              before: 'nokogiri',
              after: 'source',
              prepend: true,
              append: true,
            },
            body: 'inserted at line 3',
          },
          gemfile,
        ),
      ).toMatchSnapshot()
    })
  })
})
