var ijeDB = (function() {

    // {'correct spelling of the word' :'optional HTML explanation'}
    var data = {
        'izmijeniti': false,
        'obavijestiti': '<b> Pojma nemam je li ovo točno </b>'
    };

    var checkIJE = function(inputWord) {
        var regEx = new RegExp('^' + inputWord.replace(/ije|je/i, '[i]{0,1}je') + '$');
        for (var word in data) {
            if (word.match(regEx)) {
                return {
                    'correctSpelling': word,
                    'explanation': data[word]
                };
            }
        }
        return {
            'correctSpelling': 'ne znam :(',
            'explanation': false
        };
    };

    return {
        checkIJE: checkIJE,
    };
})();

$(document).ready(function() {
    var inputField = $('#inputWord');
    var explanation = $('#optionalExplanation');
    var result = $('#result');

    $('#ijeForm').submit(function(e) {
        e.preventDefault();
        var inputWord = inputField.val();
        if (inputWord) {
            var res = ijeDB.checkIJE(inputWord.toLowerCase());
            result.text(res.correctSpelling);
            if (res.explanation) {
                explanation.html(res.explanation);
            } else {
                explanation.html('');
            }
        }
        else{
        	result.text('');
        	explanation.html('');
        }
    });

});
