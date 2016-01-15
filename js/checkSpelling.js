$(document).ready(function() {

    var IJEchecker = (function() {
        // {'correct spelling of the word' :'optional HTML explanation'}
        var data = null;
        var dataPropertiesStringified = '';
        var DONT_KNOW = 'Ne znam :(';
        var NO_IJE_CH_DZ = 'Izgleda da u traženoj riječi ne postoji <b>{ije,je}, {c,č,ć}</b> niti <b>{d,dž,đ}</b>';
        var response = {
            'correctSpelling': [],
            'explanation': []
        };

        var setData = function(json) {
            data = json;
            dataPropertiesStringified = String(Object.getOwnPropertyNames(data));
        };

        var checkSpelling = function(inputWord) {
            var response = {
                'correctSpelling': [],
                'explanation': []
            };
            if (!(/ije|je|[cčćdđž]/).test(inputWord)) {
                response.correctSpelling[0] = NO_IJE_CH_DZ;
                response.explanation[0] = '';
            }else {
                var pattern = inputWord.replace(/ije|je/i, '[i]{0,1}[j]{0,1}e')
                    .replace(/c|ć|č/gi, '[cčć]{1}')
                    .replace(/s/gi, '[sš]{1}')
                    .replace(/z/gi, '[zž]{1}')
                    .replace(/d|đ|dž/gi, '[dđdž]{1,2}');

                var regEx = new RegExp('\\b' + pattern + '\\b', 'g');
                var matchedWords = dataPropertiesStringified.match(regEx);
                for (var i in matchedWords) {
                    var word = matchedWords[i];
                    response.correctSpelling.push(word);
                    response.explanation.push(data[word]);
                }
            }
            if (response.correctSpelling.length === 0){
                response.correctSpelling.push(DONT_KNOW);
                response.explanation.push('');
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

            resultOutput.fadeOut(200, function() {
                resultOutput.html(responseObj.correctSpelling.join(' ili '));
                resultOutput.fadeIn(200);
                if (resultContainer.isHidden) {
                    resultContainer.fadeIn(200);
                    resultContainer.isHidden = false;
                }
                if (responseObj.explanation.length ) {
                    explanationOutput.html(responseObj.explanation[0]);
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
