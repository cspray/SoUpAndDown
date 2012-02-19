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
    return {
        getVoteCount: function(request) {
            if (request.type == "question") {
                this.getQuestionVoteCount(request.host, request.id);
            }
            if (request.type == "answer") {
                this.getAnswerVoteCount(request.host, request.id);
            }
        },
        getQuestionVoteCount: function(host, id) {
            var url = "https://api.stackexchange.com/2.0/questions/" + id;
            var apiData = {
                site: host,
                filter: "!awRehpC1pG2C(t"
            };
            var selector = "[data-questionid=" + id + "] .se-up-down";
            var element = $(selector);
            $.get(url, apiData, function(data) {
                var info = data.items[0];
                var upVotes = 0;
                if (info.up_vote_count > 0) {
                    upVotes = '+' + info.up_vote_count;
                }
                var html = '<div style="color:green;">' + upVotes + '</div>';
                html = html + '<div class="vote-count-separator"></div>';
                var downVotes = 0;
                if (info.down_vote_count > 0) {
                    downVotes = '-' + info.down_vote_count;
                }
                html = html + '<div style="color:maroon;">' + downVotes + '</div>';
                element.html(html);
                element.removeClass('se-up-down');
            });
        },
        getAnswerVoteCount: function(host, id) {
            var url = "https://api.stackexchange.com/2.0/answers/" + id;
            var apiData = {
                site: host,
                filter: "!6Jzry)jfEAcuO"
            };
            var selector = "[data-answerid=" + id + "] .se-up-down";
            var element = $(selector);
            $.get(url, apiData, function(data) {
                // note that there is currently a bug in the filter for this answer
                // please see http://stackapps.com/questions/3147/answer-up-down-vote-count-not-being-returned-in-filter
                console.log(data);
//                var info = data.items[0];
//                var html = '<div style="color:green;">' + info.up_vote_count + '</div>';
//                html = html + '<div class="vote-count-separator"></div>';
//                html = html + '<div style="color:maroon;">' + info.down_vote_count + '</div>';
//                element.html(html);
//                element.removeClass('se-up-down');
            });
        }
    };

}

var userRep = getUserRep();
addSEUpDownClass(userRep);
$(".se-up-down").live("click", function() {
    var post = $(this).parents('table').parent('div');
    var postInfo = getPostInfo(post);
    var StackApi = getStackApi();
    StackApi.getVoteCount(postInfo);
});


