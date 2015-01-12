$(document).ready(function() {

    var IJEchecker = (function() {
        // {'correct spelling of the word' :'optional HTML explanation'}
        var data = null;
        var DONT_KNOW = 'Ne znam :(';
        var NO_IJE_CH_DZ = 'Izgleda da u traženoj riječi ne postoji <b>{ije,je}, {c,č,ć}</b> niti <b>{d,dž,đ}</b>';
        var response = {
            'correctSpelling': DONT_KNOW,
            'explanation': ''
        };

        var setData = function(json) {
            data = json;
        };

        var checkSpelling = function(inputWord) {
            response.correctSpelling = DONT_KNOW;
            response.explanation = '';


            if (!(/ije|je|[cčćdđž]/).test(inputWord)) {
                response.correctSpelling = NO_IJE_CH_DZ;

            } else if (data[inputWord]) {
                response.correctSpelling = inputWord;
                response.explanation = data[inputWord];
            } else {
                var pattern = inputWord.replace(/ije|je/i, '[i]{0,1}[j]{0,1}e')
                    .replace(/c|ć|č/gi, '[cčć]{1}')
                    .replace(/s/gi, '[sš]{1}')
                    .replace(/z/gi, '[zž]{1}')
                    .replace(/d|đ|dž/gi, '[dđdž]{1,2}');

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
            checkSpelling: checkSpelling,
            setData: setData
        };
    })();


    var resultModule = (function() {
        var resultContainer = $('.resultContainer');
        resultContainer.isHidden = true;
        var resultOutput = $('#resultOutput');
        var explanationContainer = $('.explanationContainer');
        var explanationOutput = $('#explanationOutput');
        var IJEchecker = null;
        resultContainer.fadeOut();

        var setIJEchecker = function(IJEcheckerObj) {
            IJEchecker = IJEcheckerObj;
        };

        var displayOutputForWord = function(word) {
            var responseObj = IJEchecker.checkSpelling(word.toLowerCase());
            //console.log(responseObj);

            resultOutput.fadeOut(200, function() {
                resultOutput.html(responseObj.correctSpelling);
                resultOutput.fadeIn(200);
                if (resultContainer.isHidden) {
                    resultContainer.fadeIn(200);
                    resultContainer.isHidden = false;
                }

                if (responseObj.explanation) {
                    explanationOutput.html(responseObj.explanation);
                    explanationContainer.fadeIn(200);
                } else {
                    explanationContainer.fadeOut(200);
                    explanationOutput.html('');
                }
            });
        };

        var hideResultContainer = function() {
            resultContainer.fadeOut(200);
            explanationContainer.fadeOut(200);
            resultOutput.html('');
            explanationOutput.html('');
        };

        return {
            setIJEchecker: setIJEchecker,
            displayOutputForWord: displayOutputForWord,
            hideResultContainer: hideResultContainer
        };

    })();



    var inputField = $('#inputWord');
    var loadingSpinner = $('.loading');
    resultModule.setIJEchecker(IJEchecker);
    //on first page load, check if there's a url search query
    var query = decodeURI(location.search).split('=')[1];
    inputField.val(query);


    $('#ijeForm').submit(function(e) {
        e.preventDefault();
        loadingSpinner.fadeIn(100);

        var inputWord = inputField.val().trim();
        if (inputWord) {
            window.history.pushState('', '', '?search=' + inputWord);
            resultModule.displayOutputForWord(inputWord);
        } else {
            resultModule.hideResultContainer();
        }
        loadingSpinner.fadeOut(200);

    });

    $.getJSON('js/ijeChDzData.min.json', function(json) {
        IJEchecker.setData(json);
        console.log('gotJson!');
        if (query) {
            $('#ijeForm').submit();
        }
    });


});
