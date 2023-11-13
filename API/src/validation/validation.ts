import * as sanitizeHtml from 'sanitize-html'

export const validateInput = (input: string) => {
  const clean = sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  })

  return clean
}
