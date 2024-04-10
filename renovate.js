module.exports = {
  branchPrefix: 'test-renovate/',
  username: 'renovate-release',
  gitAuthor: 'Renovate Bot <bot@renovateapp.com>',
  onboarding: false,
  platform: 'github',
  includeForks: true,
  dryRun: 'full',
  //repositories: [process.env.GITHUB_REPOSITORY], // use the GITHUB_REPOSITORY environment variable
  gitUrl: 'git@github.com:csas-dev/inet-terraform-ghb-modul-github-files.git',
  packageRules: [
    {
      description: 'lockFileMaintenance',
      matchUpdateTypes: [
        'pin',
        'digest',
        'patch',
        'minor',
        'major',
        'lockFileMaintenance',
      ],
      dependencyDashboardApproval: false,
      stabilityDays: 0,
    },
    {
      //"matchPackageNames": ["node"],
      "groupName": "GitHub Actions",
      "matchManagers": ["github-actions"],
      "fileMatch": [
        "(^|/)(workflow-templates|\\.(?:github|gitea|forgejo)/(?:workflows|actions))/.+\\.ya?ml$",
        "(^|/)action\\.ya?ml$",
        "(^|/)\\files/(?:dev|ops)/(?:be|fe|terraform)/(?:LAF/)?.+\\.ya?ml$",
      ]
    },
  ],
};