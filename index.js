// Description:
//  Watch Github resources in messages and expands to readable text
//
// Author:
//   Christophe Hamerling

const GithubClient = require('github');
const parseUrl = require('parse-github-url');

const repositoryRegexp = new RegExp('(?:git|https?|git@)(?:\\:\\/\\/)?github.com[/|:][A-Za-z0-9-]+?\\/[\\w\\.-]+\\/?(?!=.git)(?:\\.git(?:\\/?|\\#[\\w\\.\\-_]+)?)?$');

const github = new GithubClient({
  headers: {
    'user-agent': 'hubot-github-expand'
  }
});

module.exports = (robot) => {

  robot.hear(repositoryRegexp, getRepositoryAsText);

  function getRepositoryAsText(res) {
    const url = res.match[0].trim();
    if (!url) {
      return robot.logger.info('no github url found')
    }

    const parsed = parseUrl(url);

    github.repos.get({
      owner: parsed.owner,
      repo: parsed.name
    }, (err, repo) => {
      if (err || !repo) {
        return robot.logger.error('Can not get repository information', err);
      }

      res.send(`${repo.full_name}: ${repo.description} - ${repo.stargazers_count} ⭐️`);
    });
  }

  return {
    getRepositoryAsText
  };
};
