$(document).ready(function() {

    var IJEchecker = (function() {
        // {'correct spelling of the word' :'optional HTML explanation'}
        var data = null;

        $.getJSON("js/IJEdata.json", function(json) {
            data = json;
            //console.log(data)
        });

        var checkIJE = function(inputWord) {
            var response = {
                'correctSpelling': 'ne znam :(',
                'explanation': false
            };

            if (data[inputWord]) {
                response.correctSpelling = inputWord;
                response.explanation = data[inputWord];
            } else {
                var pattern = inputWord.replace(/ije|je/i, '[i]{0,1}[j]{0,1}e')
                    .replace(/c|ć|č/i, '[cčć]{1}')
                    .replace(/s/i, '[sš]{1}')
                    .replace(/z/i, '[zž]{1}');
                var regEx = new RegExp('^' + pattern + '$');
                for (var word in data) {
                    if (word.match(regEx)) {
                        response.correctSpelling = word;
                        response.explanation = data[word];
                        break;
                    }
                }
            }
            return response;
        };

        return {
            checkIJE: checkIJE,
        };
    })();


    var resultModule = (function() {
        var resultContainer = $('.resultContainer');
        var resultOutput = $('#resultOutput');
        var explanationContainer = $('.explanationContainer');
        var explanationOutput = $('#explanationOutput');
        var IJEchecker = null;
        resultContainer.fadeOut();

        var setIJEchecker = function(IJEcheckerObj) {
            IJEchecker = IJEcheckerObj;
        };

        var displayOutputForWord = function(word) {
            var responseObj = IJEchecker.checkIJE(word.toLowerCase());
            console.log(responseObj);
            resultOutput.text(responseObj.correctSpelling);
            resultContainer.fadeIn(200);

            if (responseObj.explanation) {
                explanationOutput.html(responseObj.explanation);
                explanationContainer.fadeIn(200);
            } else {
                explanationContainer.fadeOut(200);
                explanationOutput.html('');
            }
        };

        var hideResultContainer = function() {
            resultContainer.fadeOut(200);
            explanationContainer.fadeOut(200);
            resultOutput.text('');
            explanationOutput.html('');
        };

        return {
            setIJEchecker: setIJEchecker,
            displayOutputForWord: displayOutputForWord,
            hideResultContainer: hideResultContainer
        };

    })();

    var inputField = $('#inputWord');
    resultModule.setIJEchecker(IJEchecker);

    $('#ijeForm').submit(function(e) {
        e.preventDefault();
        var inputWord = inputField.val();
        if (inputWord) {
            resultModule.displayOutputForWord(inputWord);
        } else {
            resultModule.hideResultContainer();
        }
    });

});
