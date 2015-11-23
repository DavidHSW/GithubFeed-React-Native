class Routes {
	static feeds() {
		return {
			component: require('./FeedComponent'),
			title: 'Feed',
		};
	}

	static watchings() {
		return {
			component: require('./WatchingComponent'),
			title: 'watch',
		}
	}

	static trends() {
		return {
			component: require('./TrendComponent'),
			title: 'trend'
		}
	}

	static personal() {
		return {
			component: require('./PersonalComponent'),
			title: 'me'
		}
	}

	static repo(repo) {
		return {
			component: require('./RepoComponent'),
			title: repo.name
		}
	}
}

module.exports = Routes;
