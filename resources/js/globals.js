///////////////////////////////////////////////////////////
/* golobal variables */
///////////////////////////////////////////////////////////
var appName = 'Actor',//Application name
    /** @type {String} */
    domain = '',
    /** @type {Object} */
    formLib,
    /** @type {String */
    defaultFormName = 'Information',
    /** @type {String} */
    currentPlugin = '',
    /** @type {Number} */
    windowMaxHeight = window.innerHeight - 35,
    windowMaxWidth = window.innerWidth - 35,
    gridRowHeight = 90,//default height of grid
    /** @type {String} */
    sessionId,//user id who is using now
    /** @type {Object} */
    userInfo,//user information for using now
    /** @type {Object} */
    companyInfo,//company information
    /** @type {Boolean} */
    tabletMode = false,//check if the monitor is small
    defaultFormName = 'Information';
    /** @type {Array} */
    shortcuts = [];//user's shortcuts


///////////////////////////////////////////////////////////
/* preference variables */
///////////////////////////////////////////////////////////
var preference, //Preference window instance
    config = {};
var basicSetting = {
    numOfItem:30,
    numOfViewed:30,
    numOfPrinted:30
};
var basicItems = ['bd_subject', 'bd_file', 'bd_regdate', 'bd_colortag', 'bd_ip', 'bd_content', 'bd_name', 'bd_idx'];
var pluginName = '';
///////////////////////////////////////////////////////////
/* golobal methods */
///////////////////////////////////////////////////////////
if(document.location.hostname != 'localhost'){
    domain = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
}
else{
    domain = 'http://smartdb.kr';
//     domain = 'http://hanyoung.dipol.co.kr:8080';
//     domain = 'http://cma.dipol.co.kr:10080';
//     domain = 'http://localhost:8080/Nview3';
//         domain = 'http://hygdn.dipol.co.kr';
//     domain = 'http://data.samwoodtp.com';
//     domain = "http://samsung.dipol.co.kr";
//     domain = 'http://design.samsungcaravel.com';
//     domain = 'http://localhost:8080/Nview3';
//         domain = 'http://samwoo.dipol.co.kr';
//     domain = 'http://biospectrum.dipol.co.kr';123
}

/**
 * @param {String } cName, a nameof
 * @returns {Object} 
 */
function getController(cName){
    return eval(appName).app.getController(cName);
}

/**
 * @param {String } value, category options
 * @returns {Object} 
 */
function getOption(value){
    var options = {};
    if(value == 'null' || value === null || value === undefined) value = '';
    var tmpArr = value.split('--');
    if(tmpArr.length === 0) options = false;
    for(var i=0; i<tmpArr.length; i++){
        if(tmpArr[i] !== ''){
            var oUnit = tmpArr[i].split(':');
            if(oUnit[1] !== undefined){
                var isBool = (oUnit[1].trim() == 'true' || oUnit[1].trim() == '1'|| oUnit[1].trim() == 'false' || oUnit[1].trim() == '0')? true : false;
                var res;
                if(isBool){
                    res = (oUnit[1].trim() == 'true' || oUnit[1].trim() == '1')? true : false;
                }
                else {
                    res = oUnit[1].trim();
                }
                //in case of numberFormat option for field
                if(oUnit[0] === 'numberFormat') res = oUnit[1].trim();
                options[oUnit[0].trim()] = res;
            }
            else{//값이 지정 안됐거나 포맷이 안맞으면
                options.error = tmpArr[i];
            }
        }
    }
    return options; 
}

/**
 * check if the browser suppports Html 5
 * @retruns {Boolean}
 */
function isHtml5(){
    var canvasEl = document.createElement('canvas'); //create the canvas object
    value = true;
    if(!canvasEl.getContext){
        value = false;
    }
    return value;
}
/**
 * finding out current a kind of current browser
 * @retruns {String}
 */
function detectIE() {
    var ua = window.navigator.userAgent;

    // Test values; Uncomment to check result …

    // IE 10
    // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

    // IE 11
    // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

    // Edge 12 (Spartan)
    // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

    // Edge 13
    // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }

    // other browser
    return false;
}
/**
 * generate a random charactors to us image cache
 * @retruns {String}
 */
function randomString(len, bits) {
    bits = bits || 36;
    var outStr = "", newStr;
    while (outStr.length < len)
    {
        newStr = Math.random().toString(bits).slice(2);
        outStr += newStr.slice(0, Math.min(newStr.length, (len - outStr.length)));
    }
    return outStr.toUpperCase();
}

if(detectIE()){
    window.localStorage.keepInformation = 'true';
}


///////////////////////////////////////////////////////////
/* API methods */
///////////////////////////////////////////////////////////
/**
 * @param {String } userId
 * @param {String } password
 * @returns {Object} 
 */
function getLoginApi(userId, password){
    return domain + "/json/login";
}
/**
 * @returns {Object} 
 */
function getMemberViewApi(){
    return domain + '/json/memberView';
}
/**
 * @returns {Object} 
 */
function getMemberUpdateApi(){
    return domain + '/json/memberUpdate';
}
/**
 * getting information of category   
 * @param {String } node, category id
 * @returns {Object} 
 */
function getCategoryViewApi(node){
    if(node === undefined) node = '';
    return domain + "/json/cateView?ca_id=" + node;
}
/**
 * list of sub categories
 * @param {String } node, category id
 * @returns {Object} 
 */
function getCategoryListApi(node){
    var query = (node)? 'node=' + node : '';
    return domain + "/json/cateList?" + query;
}
/**
 * updating category information
 */
function getCategoryUpdateApi(){
    return domain + '/json/cateAddUpdate';
}
/**
 * updating category option
 */
function getCategoryOptionUpdateApi(caId, option){
    return domain + '/json/cateOptionUpdate?ca_id=' + caId + '&ca_option=' + option;
}
/**
 * se_all searching for though all  
 * se_subject serching by subject
 * se_content serching by description
 * se_colortg searching by colortag
 * se_user_id serching by an user
 * se_user_name searching by an user name
 * @params {String} query, parameters 
 * @params {Boolean} isSimpleMode, if true, get simple result
 * @params {Boolean} viewCategoryInfo, to get result including category information 
 */

function getDataListByIdApi(query, isSimpleMode, viewCategoryInfo){
    if(query === undefined || query === '') query = '';
    if(viewCategoryInfo) query += '&o=c';
    var val = domain + "/json/list?" + query;
    if(isSimpleMode){
        val += '&o=s';
    }
    return val;
}
/** not used */
function getDataListByCodeApi(code, query, isSimpleMode){
    if(query === undefined) query = '';
    var val = domain + "/json/list?ca_code=" + code + query;
    if(!isSimpleMode){
        val += '&o=s';
    }  
    return val;
}
/**
 * bd_idx code of row 
 * ca_id category id
 * ca_code category code 
 * html [0] toggle if use html format
 */

function getDataWriteApi(){
    return domain +'/json/write';
}

/**
 * bd_idx row code of data list 
 * @params {String} idx, bd_idx code of row 
 */
function getCommentListApi(idx){
    return domain + "/json/Comment"; 
}

/**
 * @params {String } idx, cmt_idx row code of comment list
 */
function getCommentViewApi(idx){
    return domain + "/json/CommentView"; 
}

/**
 * write new comment
 * bd_idx row code of data list 
 * cmt_idx row code of comment list
 * cmt_content comment
 * cmt_name name in case of nonmember
 * cmt_passowrd password in case of nonmember
 */
function getCommentUpdateApi(){
    return domain + "/json/CommentUpdate"; 
}

/**
 * bd_idx row code of data list 
 * @params {String} idx, cmt_idx row code of comment list
 */
function getCommentDeleteApi(idx){
    return domain + "/json/CommentDel"; 
}
/**
 * @params bd_idx row code to delete
 */
function getDeleteDataApi(){
    return domain + "/json/delete";
}
/** 
 * @params cols_idx, cols_option
 */
function getFieldOptionApi(){
    return domain + '/json/colsOptionUpdate';
}
/**
 * bd_idx row code of data list 
 * data_xxxx field idx, xxxx means field id
 * for dataset field
 * value of data_is bd_idxs of sub category
 * ex) data_0027=,,&cols_data_0028=1&cols_data_0029=2&cols_data_0030=3//new post
 * ex) data_xxxx=970, 971, 972
 * data_idx=,,, in update mode
 * cols_data_xxxx data in each dataset column (values are separeted by ',')
 * ex) cols_data_xxxx=val1,val2,val3&cols_data_yyyy=val4,val5,val6
 */
function getUpdateApi(){
    return domain + '/json/addUpdate';
}
function getViewApi(){
    return domain + '/json/view';
}
function getSessionApi(){
    return domain + '/json/session';
}
function getLogoutApi(){
    return domain + '/json/logout';
}
function getUpdateApprovalApi(){
    return domain + '/json/approval';
}
function getHistoryApi(){
    return domain + '/json/history';
}
/**
 * copy field to another category
 * @params {String} source, id of source category
 * @params {String} target, id of target category
 */
function getColsCopyApi(source, target){
    return domain + '/category/colsCopy?ca_id='+target+'&ca_id2='+source;
}
