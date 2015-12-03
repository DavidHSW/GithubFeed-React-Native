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
			component: require('./FeedComponent'),
			title: 'me'
		}
	}

	static repo(repo) {
		return {
			component: require('./RepoComponent'),
			title: repo.name,
			passProps: {repo: repo},
		}
	}

	static user(user) {
		return {
			component: require('./UserComponent'),
			title: user.login,
			passProps: {user: user},
		}
	}
}

module.exports = Routes;
