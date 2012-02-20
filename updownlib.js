function SoUpDown(Api) {

    var StackApi = Api;

    var repLimit = 999;

    var extensionClass = "so-up-and-down";

    var userRepSelector = "#hlinks-user .reputation-score";
    var voteCountPostSelector = ".vote-count-post";

    // A data attribute storing the id value for the question or answer
    // We are using this attribute as answer posts do not have a normal id whereas questions do
    var questionIdAttribute = "data-questionid";
    var answerIdAttribute = "data-answerid";

    var questionClass = "question";
    var answerClass = "answer";

    var that = this;

    // Will add the extension's class for identifying q/a vote counts to all
    // questions and answers in a Stack Exchange site.
    this.addExtensionClassToVoteCount = function() {
        if (that.getUserRep() <= repLimit) {
            $(voteCountPostSelector).addClass(extensionClass);
        }
    };

    // Will actually split the single vote score into up/down count
    // Is the function called by the extension class click event handler
    this.splitVoteCount = function(post) {
        var postInfo = getPostInfo(post);
        StackApi.getVoteCount(postInfo, renderVoteCount);
    };

    // Will return an integer with the user's reputation if logged in or 0 if not
    this.getUserRep = function() {
        var repScore = $(userRepSelector).html();
        if (repScore == null) {
            repScore = 0;
        } else {
            repScore = parseInt(repScore.replace(/,/, ''));
        }
        return repScore;
    };

    // Returns an object with the 'type', 'id', and 'host' for the q/a to split count of
    function getPostInfo(post) {
        var postClass = post.attr('class');
        var postId = 0;
        if (postClass == questionClass) {
            postId = post.attr(questionIdAttribute);
        }
        if (postClass == answerClass) {
            postId = post.attr(answerIdAttribute);
        }
        postId = parseInt(postId);
        var host = window.location.host
        return {
            type: postClass,
            id: postId,
            host: host
        };
    }

    // Used to input the data for vote count into the appropriate q/a based on the request sent
    function renderVoteCount(request, data) {
        var selector = "[data-" + request.type + "id=" + request.id + "] ." + extensionClass;
        var element = $(selector);

        var normalizeInfo = function(info) {
            var data = {};
            if (info.up_vote_count == undefined || info.up_vote_count == 0) {
                data.up = 0;
            } else {
                data.up = "+" + info.up_vote_count;
            }

            if (info.down_vote_count == undefined || info.down_vote_count == 0) {
                data.down = 0;
            } else {
                data.down = "-" + info.down_vote_count;
            }
            return data;
        };

        var getHtml = function(info) {
            var html = "";
            html = html + "<div style=\"color: green;\">" + info.up + "</div>";
            html = html + "<div class=\"vote-count-separator\"></div>";
            html = html + "<div style=\"color: maroon;\">" + info.down + "</div>";
            return html;
        };

        var info = normalizeInfo(data.items[0]);
        element.html(getHtml(info));
    }

}

function StackApi() {

    var apiUrl = "https://api.stackexchange.com/2.0/";

    var questionsUrl = apiUrl + "questions/";
    var answersUrl = apiUrl + "answers/";

    // The different request types we are expecting
    var expectedQuestionType = "question";
    var expectedAnswerType = "answer";

    var questionFilter = "!awRehpC1pG2C(t";
    var answerFilter = "!6Jzry)jfEAcuO";

    this.getVoteCount = function(request, renderer) {
        request.apiUrl = getApiUrl(request);
        request.apiFilter = getApiFilter(request);
        queryForVoteCount(request, renderer);
    };

    function getApiUrl(request) {
        var url = apiUrl;
        if (request.type == expectedQuestionType) {
            url = questionsUrl + request.id;
        }
        if (request.type == expectedAnswerType) {
            url = answersUrl + request.id;
        }
        return url;
    }

    function getApiFilter(request) {
        var filter = '';
        if (request.type == expectedQuestionType) {
            filter = questionFilter;
        }
        if (request.type == expectedAnswerType) {
            filter = answerFilter;
        }
        return filter;
    }

    function queryForVoteCount(request, renderer) {
        var url = request.apiUrl;
        var apiData = {
            site: request.host,
            filter: request.apiFilter,
            pagesize: 1,
            page: 1
        };
        var ajaxSettings = {
            data: apiData,
            error: function(jqHr, status, error) {
                console.log("Show better error message eventually");
            },
            success: function(data, status, jqHr) {
                if (data.items == undefined || data.items.length == 0) {
                    console.log("Unexpected error encountered.");
                    return;
                }
                renderer(request, data);
            },
            url: url
        }
        $.ajax(ajaxSettings);

    }
}

var StackApi = new StackApi();
var SoUpDown = new SoUpDown(StackApi);

SoUpDown.addExtensionClassToVoteCount();

$(".so-up-and-down").on("click", function() {
    var post = $(this).parents("table").parent("div");
    SoUpDown.splitVoteCount(post);
});


