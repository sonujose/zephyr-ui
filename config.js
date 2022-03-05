var path = require('path');

var root = path.join(__dirname);

var config = {
    rootDir:                root,
    // Targets ========================================================
    serveDir:               path.join(root, '.serve'),
    distDir:                path.join(root, 'dist'),
    clientManifestFile:     'manifest.webpack.json',
    clientStatsFile:        'stats.webpack.json',

    // Source Directory ===============================================
    srcDir:                 path.join(root, 'app'),
    srcServerDir:           path.join(root, 'server'),

    // HTML Layout ====================================================
    srcHtmlLayout:          path.join(root, 'app', 'index.html'),

    // Site Config ====================================================
    siteTitle:              'Sira | Devops Native kubernetes deployment platform',
    siteDescription:        'Devops native kubernetes deployment platform',
    siteCannonicalUrl:      'http://sira.centralindia.cloudapp.azure.com',
    siteKeywords:           'Kubernetes dashboard devops',
    scssIncludes:           [],

    // api endpoint
    apiBaseURL: 'http://sira-core.centralindia.cloudapp.azure.com',

    // Individual api endpoints
    apiEndpoints: {
        getServices: '/api/services'

    }
}

module.exports = config;