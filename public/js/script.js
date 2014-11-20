$(function() {
	SimpleJekyllSearch.init({ 
		searchInput: document.getElementById('search-input'), 
		resultsContainer: document.getElementById('results-container'),
		dataSource: "search.json", 
		template: "<a href='{url}' title='{desc}'>{title}</a>", 
		fuzzy: true 
	});
});
