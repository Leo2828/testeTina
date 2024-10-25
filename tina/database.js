import { createDatabase, createLocalDatabase } from '@tinacms/datalayer'

// Change this to your chosen git provider
import { GitHubProvider } from 'tinacms-gitprovider-github'

// Change this to your chosen database adapter
import { MongodbLevel } from 'mongodb-level'

// Manage this flag in your CI/CD pipeline and make sure it is set to false in production
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'false'

const branch =
  (process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || 'main')

if (!branch) {
  throw new Error(
    'No branch found. Make sure that you have set the GITHUB_BRANCH or process.env.VERCEL_GIT_COMMIT_REF environment variable.'
  )
}

export default isLocal
  ? createLocalDatabase()
  : createDatabase({
        // May very depending on your git provider
        gitProvider: new GitHubProvider({
            repo: process.env.GITHUB_REPO || process.env.VERCEL_GIT_REPO_SLUG,
            owner: process.env.GITHUB_OWNER || process.env.VERCEL_GIT_REPO_OWNER,
            token: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
            branch,
        }),
        // May very depending on your database adapter
        databaseAdapter: new MongodbLevel({
            // If you are not using branches you could pass a static collection name. ie: "tinacms"
            collectionName: `tinacms-${branchName}`,
            dbName: 'tinacms',
            mongoUri: process.env.MONGODB_URI,
        }),
    })