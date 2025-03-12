document.getElementById('csvFileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    Papa.parse(file, {
        header: true,
        complete: function(results) {
            window.data = results.data;
            initializeDashboard();
        }
    });
});

const topCompetitors = [
  "Zillow", "Realtor.com", "Redfin", "Trulia", "Apartments.com", "Real Estate Australia", "PropertyGuru", "Rightmove", "Domain", "Ray White",
  "microsoft", "google", "amazon", "meta", "facebook", "airbnb", "spotify", "linkedin", "instacart", "netflix", "aws", "amazon web", "booking", "booking.com", "expedia", "ebay", "rea", "rea group", "rightmove", "zillow", "realtor", "realtor.com", "adevinta", "scout24", "scout",
  "SAP", "Oracle", "Microsoft", "Salesforce", "Adobe", "ServiceNow", "Workday", "VMware", "Infor", "Autodesk", "IBM", "OpenText", "intuit", "shopify", "cisco", "hubspot", "amazon", "google",
  "Uber", "Airbnb", "Amazon", "eBay", "Alibaba", "Etsy", "Fiverr", "TaskRabbit", "Upwork", "DoorDash", "Instacart", "Bolt", "Lime", "Thumbtack", "Poshmark", "Farfetch", "Grubhub", "Zalando", "Shopify", "Vinted", "Turo", "StockX", "Mercari", "Rakuten", "Booking.com", "Expedia", "Vrbo", "Tripadvisor", "Hopper", "Skyscanner", "KAYAK", "HomeAway", "Sonder", "Vacasa", "Plum Guide", "GetYourGuide", "Hipcamp", "Selina", "Zillow", "Redfin", "Realtor.com", "Opendoor", "Compass", "Trulia", "Homes.com", "LoopNet", "Apartments.com", "CoStar", "Rightmove", "Zoopla", "StreetEasy", "Idealista", "Funda", "Hemnet", "Rea Group", "Adevinta", "Spotify", "Adyen", "Klarna", "Revolut", "Wise", "N26", "Checkout.com", "Delivery Hero", "Doctolib", "Back Market", "Personio", "Sorare", "BlaBlaCar", "OVHcloud", "Typeform", "Miro", "Deezer", "Trainline", "Qonto", "SumUp", "Jobandtalent", "Alan", "FlixBus", "Glovo", "Auto1 Group", "Vestiaire Collective", "Lyst", "Trustpilot", "MessageBird", "UiPath", "Google", "Meta", "Microsoft", "Apple", "Stripe", "PayPal", "Salesforce", "Netflix", "TikTok", "Snapchat", "Zoom", "Atlassian", "HubSpot", "LinkedIn", "Twilio", "Snowflake", "ServiceNow", "Grab", "GoTo", "Gojek", "Tokopedia", "Sea Group", "Shopee", "Lazada", "Razer", "Traveloka", "Carousell", "Zalora", "Bukalapak", "OYO", "Grab Financial Group", "Gcash", "MoMo", "Tiki", "VNPay", "Naver", "Kakao", "Coupang", "Line", "PayPay", "SmartNews", "DMM.com", "linkedin"
];

function countTopCompetitors() {
    let competitorCounts = {};
    window.data.forEach(item => {
        const company = item['Current Company'];
        if (topCompetitors.includes(company)) {
            competitorCounts[company] = (competitorCounts[company] || 0) + 1;
        }
    });

    displayTopCompetitors(competitorCounts);
}

const propertyLocations = ["Dubai", "Abu Dhabi", "Ajman", "Riyadh", "Doha", "Cairo"];

function countCandidatesInPropertyLocations() {
    let locationCounts = {};
    window.data.forEach(item => {
        let location = item['Location'];
        if (propertyLocations.includes(location)) {
            locationCounts[location] = (locationCounts[location] || 0) + 1;
        }
    });

    if (Object.keys(locationCounts).length > 0) {
        displayPropertyLocations(locationCounts);
    } else {
        document.getElementById('dashboard').innerHTML += '<p>No candidates found in property locations.</p>';
    }
}

function displayPropertyLocations(locationCounts) {
    const container = document.createElement('div');
    container.className = "property-locations-column";
    container.innerHTML = `<h2>Candidates in Property Locations</h2>`;
    let maxCount = Math.max(...Object.values(locationCounts));
    
    Object.entries(locationCounts).forEach(([location, count]) => {
        let width = (count / maxCount) * 100;
        container.innerHTML += `<div>${location}: <div class="bar-container"><div class="bar" style="width:${width}%;">${count}</div></div></div>`;
    });

    document.getElementById('dashboard').appendChild(container);
}

function displayTopCompetitors(competitorCounts) {
    const container = document.createElement('div');
    container.className = "competitors-column";
    container.innerHTML = `<h2>Top Competitors</h2>`;
    let maxCount = Math.max(...Object.values(competitorCounts));

    Object.entries(competitorCounts).forEach(([company, count]) => {
        let width = (count / maxCount) * 100;
        container.innerHTML += `<div>${company}: <div class="bar-container"><div class="bar" style="width:${width}%;">${count}</div></div></div>`;
    });

    document.getElementById('dashboard').appendChild(container);
}

function initializeDashboard() {
    calculateTotalCandidates();
    populateFilters();
    extractTopJobTitles();
    extractTopLocations();
    countAllCompanies();
    extractStatusCounts();
    countTopCompetitors();
    applyFilters();
    countCandidatesInPropertyLocations();
}

function populateStatusFilter() {
    let statusSet = new Set();
    window.data.forEach(item => {
        if (item['Status']) {
            statusSet.add(item['Status']);
        }
    });
    populateFilterOptions('statusFilter', statusSet);
}

function countAllCompanies() {
    let companyCounts = {};
    window.data.forEach(item => {
        let company = item['Current Company'];
        if (company) {
            companyCounts[company] = (companyCounts[company] || 0) + 1;
        }
    });

    displayTopCompanies(companyCounts);
}

function displayTopCompanies(companyCounts) {
    const topCompanies = Object.entries(companyCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const container = document.createElement('div');
    container.className = "top-companies-column";
    container.innerHTML = `<h2>Top 5 Companies</h2>`;
    let maxCount = Math.max(...topCompanies.map(company => company[1]));
    topCompanies.forEach(([name, count]) => {
        let width = (count / maxCount) * 100;
        container.innerHTML += `<div>${name}: <div class="bar-container"><div class="bar" style="width:${width}%;">${count}</div></div></div>`;
    });

    document.getElementById('dashboard').appendChild(container);
}

function calculateTotalCandidates() {
    const totalCount = window.data.length;
    document.getElementById('totalCandidates').textContent = `Total Candidates: ${totalCount}`;
}

function extractStatusCounts() {
    let statusCounts = {};
    window.data.forEach(item => {
        let status = item['Status'];
        statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    displayStatusCounts(statusCounts);
}

function displayStatusCounts(statusCounts) {
    const container = document.createElement('div');
    container.className = "status-column";
    container.innerHTML = `<h2>Sourcing Funnel</h2>`;
    let maxCount = Math.max(...Object.values(statusCounts));
    Object.entries(statusCounts).forEach(([status, count]) => {
        let width = (count / maxCount) * 100;
        container.innerHTML += `<div>${status}: <div class="bar-container"><div class="bar" style="width:${width}%;">${count}</div></div></div>`;
    });
    document.getElementById('dashboard').appendChild(container);
}

function populateFilters() {
    let companySet = new Set();
    let locationSet = new Set();
    let statusSet = new Set();
    window.data.forEach(item => {
        companySet.add(item['Current Company']);
        locationSet.add(item['Location']);
        statusSet.add(item['Status']);
    });

    populateFilterOptions('companyFilter', companySet);
    populateFilterOptions('locationFilter', locationSet);
    populateFilterOptions('statusFilter', statusSet);

    document.getElementById('companyFilter').addEventListener('change', applyFilters);
    document.getElementById('locationFilter').addEventListener('change', applyFilters);
    document.getElementById('statusFilter').addEventListener('change', applyFilters);
}

function displayStatusGraph(statusSet) {
    const statusCounts = {};
    window.data.forEach(item => {
        const status = item['Status'];
        if (status) {
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        }
    });

    const container = document.createElement('div');
    container.className = "status-column";
    container.innerHTML = `<h2>Sourcing Funnel</h2>`;
    const maxCount = Math.max(...Object.values(statusCounts));

    Object.entries(statusCounts).forEach(([status, count]) => {
        let width = (count / maxCount) * 100;
        container.innerHTML += `<div>${status}: <div class="bar-container"><div class="bar" style="width:${width}%;">${count}</div></div></div>`;
    });

    document.getElementById('dashboard').appendChild(container);
}

function populateFilterOptions(filterId, options) {
    const filter = document.getElementById(filterId);
    filter.innerHTML = '<option value="">All</option>';
    options.forEach(option => {
        let optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        filter.appendChild(optionElement);
    });
}

function extractTopJobTitles() {
    let jobTitleCounts = {};
    window.data.forEach(item => {
        let title = item['Current Title'];
        jobTitleCounts[title] = (jobTitleCounts[title] || 0) + 1;
    });
    let topTitles = Object.entries(jobTitleCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
    displayTopJobTitles(topTitles);
}

function displayTopJobTitles(topTitles) {
    const container = document.createElement('div');
    container.className = "left-column";
    container.innerHTML = `<h2>Top Job Titles</h2>`;
    let maxCount = Math.max(...topTitles.map(title => title[1]));
    topTitles.forEach(title => {
        let width = (title[1] / maxCount) * 100;
        container.innerHTML += `<div>${title[0]}: <div class="bar-container"><div class="bar" style="width:${width}%;">${title[1]}</div></div></div>`;
    });
    document.getElementById('dashboard').appendChild(container);
}

function extractTopLocations() {
    let locationCounts = {};
    window.data.forEach(item => {
        let location = item['Location'];
        locationCounts[location] = (locationCounts[location] || 0) + 1;
    });
    let topLocations = Object.entries(locationCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
    displayTopLocations(topLocations);
}

function displayTopLocations(topLocations) {
    const container = document.createElement('div');
    container.className = "right-column";
    container.innerHTML = `<h2>Top Locations</h2>`;
    let maxCount = Math.max(...topLocations.map(loc => loc[1]));
    topLocations.forEach(loc => {
        let width = (loc[1] / maxCount) * 100;
        container.innerHTML += `<div>${loc[0]}: <div class="bar-container"><div class="bar" style="width:${width}%;">${loc[1]}</div></div></div>`;
    });
    document.getElementById('dashboard').appendChild(container);
}

function applyFilters() {
    let filteredData = window.data;
    const companyFilterValue = document.getElementById('companyFilter').value;
    const locationFilterValue = document.getElementById('locationFilter').value;
    const statusFilterValue = document.getElementById('statusFilter').value;

    if (companyFilterValue) {
        filteredData = filteredData.filter(item => item['Current Company'] === companyFilterValue);
    }
    if (locationFilterValue) {
        filteredData = filteredData.filter(item => item['Location'] === locationFilterValue);
    }
    if (statusFilterValue) {
        filteredData = filteredData.filter(item => item['Status'] === statusFilterValue);
    }

    displayFilteredProfiles(filteredData);
}

function displayFilteredProfiles(profiles) {
    const table = document.getElementById('profilesTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';

    if (profiles.length === 0) {
        table.innerHTML = '<tr><td colspan="5">No matching profiles found.</td></tr>';
    } else {
        profiles.forEach(profile => {
            let row = table.insertRow();
            ['First Name', 'Current Title', 'Current Company', 'Location', 'Profile URL'].forEach(field => {
                let cell = row.insertCell();
                if (field === 'Profile URL') {
                    let link = profile[field];
                    if (link && link.startsWith("http")) {
                        let a = document.createElement('a');
                        a.href = link;
                        a.textContent = "Profile";
                        a.target = '_blank';
                        cell.appendChild(a);
                    } else {
                        cell.textContent = 'N/A';
                    }
                } else {
                    cell.textContent = profile[field];
                }
            });
        });
    }
}

document.getElementById('clearFilters').addEventListener('click', function() {
    document.getElementById('companyFilter').value = '';
    document.getElementById('locationFilter').value = '';
    document.getElementById('statusFilter').value = '';
    applyFilters();
});

initializeDashboard();