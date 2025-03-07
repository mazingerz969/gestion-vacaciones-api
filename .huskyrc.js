module.exports = {
  hooks: {
    'pre-commit': 'npm run lint && npm test',
    'pre-push': 'npm run lint && npm test',
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS'
  }
}; 