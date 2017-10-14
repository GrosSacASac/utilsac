exports.exampleTodoList = [            
    "Buy eggs , milk and everything else you need",
    "Make pancakes",
    "Eat pancakes"
];

exports.escapeHtml = (function () {
    const chr = { '"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;' };
    return function (text) {
        return text.replace(/[\"&<>]/g, function (a) { return chr[a]; });
    };
}());

exports.mimeDictionairy = {//add more as you need
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json'
};