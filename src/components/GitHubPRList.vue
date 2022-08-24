<template>
    <div class="repos-list">
        <h2 class="white--text">Offene Pull Requests ({{ this.user }})</h2>
        <div v-if="Object.keys(prs) === 0 || Object.values(prs).every(v => !v.length)" class="white--text no-prs-container text-h5">Keine offenen PRs!</div>
        <div v-else v-for="repo in this.repos" :key="repo">
            <div v-if="prs[repo]" class="repo-container">
                <h3 class="grey--text text--lighten-3">{{ repo }} (Offene PRs: {{ prs[repo].length }})</h3>
                <v-simple-table v-if="Array.isArray(prs[repo]) && prs[repo].length">
                    <thead>
                        <tr>
                            <th class="text-left">Title</th>
                            <th class="text-left">Reviewer</th>
                            <th class="text-left">Offen seit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="pr in prs[repo]" :key="pr.id">
                            <td>{{ pr.title }}</td>
                            <td>{{ pr.requested_reviewers.map(e => e.login).join(', ') }}</td>
                            <td>{{ Math.round((new Date() - new Date(pr.created_at)) / (1000 * 60 * 60 * 24)) }} Tagen</td>
                        </tr>
                    </tbody>
                </v-simple-table>
                <div v-else class="white--text no-prs-container text-h6">Keine offenen PRs im Projekt {{ `${user}/${repo}` }}</div>
            </div>
        </div>
    </div>
</template>

<script>
const activeCheckerHelper = require("../helpers/activeChecker");

export default {
    mounted: function() {
        let requestInterval = this.requestInterval || 60000;
        this.getPRs();
        setInterval(() => {
            if (!activeCheckerHelper.checkIfActive()) {
                return;
            }
            this.getPRs();
        }, requestInterval);
    },
    data() {
        return {
            prs: {}
        }
    },
    props: {
        requestInterval: Number,
        user: {
            type: String,
            default: ''
        },
        repos: {
            type: Array,
            default () {
                return []
            }
        },
        state: {
            type: String,
            default: 'open'
        }
    },
    methods: {

        async fetchToGithub(link) {
            return await fetch(link, {
                'headers': {
                    'authorization': `token ${process.env.VUE_APP_GITHUB_AUTH_TOKEN}`,
                },
                'method': 'GET',
            }).then(resp => resp.json());
        },

        getPRs() {
            console.log("GitHub PR List: request", new Date());
            this.repos.forEach(async (repo) => {
                const pullRequests = await this.fetchToGithub(`https://api.github.com/repos/${this.user}/${repo}/pulls?state=${this.state}`);
                for (const pullRequest of pullRequests) {
                    const pullRequestReviews = await this.fetchToGithub(pullRequest._links.self.href + '/reviews');
                    pullRequestReviews.reverse();

                    for (const { state } of pullRequestReviews) {
                        if (state === 'APPROVED') {
                            pullRequest.review_state = state;
                            break;
                        }
                        if (state === 'CHANGES_REQUESTED') {
                            pullRequest.review_state = state;
                            break;
                        }
                        if (state === 'COMMENTED') {
                            pullRequest.review_state = state;
                            break;
                        }
                    }
                    pullRequest.review_state = pullRequest.review_state ?? 'OPEN';
                }
                if (!this.prs[repo]) {
                    this.$set(this.prs, repo, [])
                }
                this.$set(this.prs, repo, pullRequests)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.repos-list {
    .repo-container {
        margin-bottom: 25px;
    }
    .no-prs-container {
        text-align: center;
        margin-top: 25px;
    }
}
</style>