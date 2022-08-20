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
        getPRs() {
            console.log("GitHub PR List: request", new Date());
            let that = this;

            this.repos.forEach(repo => {
                that.$http.get(`https://api.github.com/repos/${that.user}/${repo}/pulls?state=${that.state}`, {
                    headers: {
                        Authorization: `token ${process.env.VUE_APP_GITHUB_AUTH_TOKEN}`
                    }
                }).then(response => {
                    if (!that.prs[repo]) {
                        that.$set(that.prs, repo, [])
                    }
                    that.$set(that.prs, repo, response.data)
                });
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