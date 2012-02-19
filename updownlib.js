function getUserRep() {
    var repElement = $("#hlinks-user .reputation-score");
    var repScore = repElement.html();
    if (repScore == null) {
        repScore = 0;
    } else {
        repScore = repScore.replace(/,/, '');
        repScore = parseInt(repScore);
    }
    return repScore;
}

// this CSS class is used to trigger the extension sending off API request
function addSEUpDownClass(userRep) {
    if (userRep <= 999) {
        $(".vote-count-post").addClass("se-up-down");
    }
}

function getPostInfo(post) {
    var object = {};
    var postClass = post.attr('class');
    var postId = 0;
    if (postClass == "question") {
        postId = post.attr('data-questionid');
    }
    if (postClass == "answer") {
        postId = post.attr('data-answerid');
    }
    object.type = postClass;
    object.id = parseInt(postId);
    object.host = window.location.host;
    return object;
}

function getStackApi() {

    return new StackApi();

    function StackApi() {
        this.getVoteCount = function(request) {
            request.apiUrl = this.getApiUrl(request);
            request.apiFilter = this.getApiFilter(request);
            this.queryForVoteCount(request);
        };

        this.getApiUrl = function(request) {
            var apiUrl = "https://api.stackexchange.com/2.0/";
            if (request.type == "question") {
                apiUrl = apiUrl + "questions/" + request.id;
            }
            if (request.type == "answer") {
                apiUrl = apiUrl + "answers/" + request.id;
            }
            return apiUrl;
        }

        this.getApiFilter = function(request) {
            var apiFilter = '';
            if (request.type == "question") {
                apiFilter = "!awRehpC1pG2C(t";
            }
            if (request.type == "answer") {
                apiFilter = "!6Jzry)jfEAcuO";
            }
            return apiFilter;
        }

        this.queryForVoteCount = function(request) {
            var url = request.apiUrl;
            var apiData = {
                site: request.host,
                filter: request.apiFilter,
                pagesize: 1,
                page: 1
            };
            var selector = "[data-" + request.type + "id=" + request.id + "] .se-up-down";
            var element = $(selector);
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
                    }
                    var info = normalizeInfo(data.items[0]);
                    element.html(getHtml(info));
                },
                url: url
            }
            $.ajax(ajaxSettings);

        }
    }

}

var userRep = getUserRep();
addSEUpDownClass(userRep);
$(".se-up-down").live("click", function() {
    var post = $(this).parents('table').parent('div');
    var postInfo = getPostInfo(post);
    var StackApi = getStackApi();
    StackApi.getVoteCount(postInfo);
});


