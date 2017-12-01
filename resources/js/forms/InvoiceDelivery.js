Ext.define('resources.js.forms.InvoiceDelivery', {
	singleton : true,
	CLASSNAME:'InvoiceDelivery',
	getName:function(){
		return '출고송장';
	},
	isForAnyCategory:false,//모든 카테고리에서 자동으로 사용 가능 여부 설정
	fileName:'invoicedelivery.jpg',
	setHtml:function(values, viewer){
		viewer.setHidden(true);
		viewer.setWidth(700);
		var i, j;
		var baseColor = '#ffffff';
		var html;
		var headerHeight = '68px';

		if(!values.approvalList){
			headerHeight = '';
		}
		html  =  '<div class="viewer-frame" style="font-size:13px">';
		html +=  	'<div style="width:100%;height:'+headerHeight+'">';
		html +=		'<div class="viewer-header" style="padding-top:10px;height:90px">';
		if(values.companyInfo !== undefined){
			html +=  	'<img src="'+values.companyInfo.company_logo+'" class="viewer-logo" style="float:left">';
			html += 	'<div style="float:left;height:100%;margin-left:10px">';
			var compInfo = values.companyInfo.company_addr1 + ' ' + values.companyInfo.company_addr2 + '<br>TEL: ' + values.companyInfo.company_phone;
			compInfo += ', FAX:' + values.companyInfo.company_fax;
			html += 	 	'<div class="viewer-companyname-big">'+ values.companyInfo.company_name +'</div>';
			html += 	 	'<div class="viewer-addr" style="margin-top: 7px">'+ compInfo +'</div>';
			html += 	 '</div>';
		}
		var dipApv;
		if(config.option.displayApproval == 'true' || config.option.displayApproval == '1'){
			if(values.approvalList == undefined && values.approvalList == null){
				dipApv = false;
			}
			else{
				dipApv = true;
			}
		}
		else{
			dipApv = false;
		}
		if (dipApv) {
			var apvLst = values.approvalList;
			html += 	 	 '<div class="viewer-approval" style="float:right">';
			html +=			 	'<table cellpadding="0" cellspacing="0" border="1" class="approval-list">';
			html +=             	'<tr>';
			for(i=0; i<apvLst.length; i++){
				html += 					'<td height="20" width="45" align="center" title="'+apvLst[i].user_name+'">';
				html +=                     	apvLst[i].user_duty;
				html += 					'</td>';
			}
			html +=             	'</tr><tr>';
			for(i=0; i<apvLst.length; i++){
				html += 					'<td height="45" align="center" valign="middle" bdIdx="'+values.bd_idx+'" checked="'+apvLst[i].ap_chk+'" userid="'+apvLst[i].user_id+'" class="apvUnit">';
				if(apvLst[i].ap_chk == 1){
					html +=                     	'<img src="resources/images/ico_check.png">';
				}
				html += 					'</td>';
			}
			html +=             	'</tr>';
			html +=			 	'</table>';
			html += 	 	 '</div>';
		}
		html +=		 '</div>';
		html +=  	'</div>';


		var dlvDate, dlvNo, proList, etc, colsClass, clientInfo, acceptor;
		var headerHtml = '';
		for(i=0; i<values.bd_data.length; i++){
			colsClass = ' class="custom-field" fieldIndex="'+ i.toString()+'" bd_idx="'+values.bd_idx+'" cols_idx="'+values.bd_data[i].cols_idx+'" cols_name="'+values.bd_data[i].cols_name+'" cols_type="'+values.bd_data[i].cols_type + '"';
			if(values.bd_data[i].cols_code == 'delivery_date'){//날짜
				dlvDate = {dataVal:values.bd_data[i].data_val, colsName:values.bd_data[i].cols_name, cls:colsClass};
			}
			if(values.bd_data[i].cols_code == 'delivery_id'){//id
				dlvNo = {dataVal:values.bd_data[i].data_val, colsName:values.bd_data[i].cols_name};
			}
			if(values.bd_data[i].cols_code == 'item_list'){//제품목록
				proList = {dataVal:values.bd_data[i].data_val, dataHtml:values.bd_data[i].data_html, colsName:values.bd_data[i].cols_name, cls:colsClass};
			}
			if(values.bd_data[i].cols_code == 'acceptor'){//id
				acceptor = {dataVal:values.bd_data[i].data_val, colsName:values.bd_data[i].cols_name, cls:colsClass};
			}
			if(values.bd_data[i].cols_code == 'issue_options'){//기타사항
				etc = {dataVal:values.bd_data[i].data_val, colsName:values.bd_data[i].cols_name, cls:colsClass};
			}
			if(values.bd_data[i].cols_code == 'client_datagrp'){
				//지정된 거래처 정보(데이터그룹필드)
				clientInfo = {dataVal:values.bd_data[i].data_val.split('||')[0], colsName:values.bd_data[i].cols_name, cls:colsClass};
			}
			if(!dlvNo) dlvNo = '';
		}

		if(clientInfo === undefined){
			alert(loc.viewer.formNeedDbgrp);
			return;
		}

		/* Invoice ID*/
		html +=  	 '<div style="width:100%;height:65px;margin-top:50px;border-bottom:2px solid #000;background-color:'+baseColor+'">';
		if(values.bd_colortag !== ''){
		html += 		'<div style="float:left;width:10px;height:25px;margin-top:4px;background-color:'+values.bd_colortag+'"></div>';
		}
		html += 		'<div class="label-left-space" style="clear:left;font-size:40px;line-height:150%;color:black;font-weight:bold">'+categoryName+'</div>';
		html +=      '</div>';

		html +=		 '<table class="viewer-table" cellpadding="6" cellspacing="0" width="100%" style="border-bottom: 1px solid #333333">';
		html +=      	'<tr>';//Issue date
		html +=      		'<td valign="top" width="35%">';
		html +=             	'<strong>' + dlvDate.colsName + ': </strong><span '+dlvDate.cls+' style="line-height:23px">' + dlvDate.dataVal + '</span><br>';
		html +=             	'<strong>' + dlvNo.colsName + ': </strong><span  style="line-height:23px">' + dlvNo.dataVal + '</span><br>';
		html +=             	'<strong>' + acceptor.colsName + ': </strong><span '+acceptor.cls+' style="line-height:23px">' + acceptor.dataVal + '</span><br>';
		html +=      		'</td>';
		html +=      		'<td id="customerInfo"'+clientInfo.cls+' width="65%">';//customer info
		html +=      		'</td>';
		html +=      	'</tr>';
		html +=		 '</table>';

		var parser = new DOMParser();
		var doc = parser.parseFromString(proList.dataHtml, "text/html");
		var trs = Ext.get(doc).el.select('tr').elements;
		var tSum = 0;
		var uSum = 0;
		var cellLen;
		html +=      '<div style="height:14px"></div>';
		html +=		 '<table style="margin-top10px;border-collapse: collapse;font-size:13px" border="1" cellpadding="6" cellspacing="0" width="100%" '+proList.cls+'>';
		for(i=0; i<trs.length; i++){//header of dataset table
			if(i==0){//for the first column(header)
				cellLen = trs[i].childNodes.length;
		html +=      	'<tr>';
				for(j= 0; j<cellLen; j++){
					var headerVal = trs[i].childNodes[j].textContent;
					if(headerVal == '') cellVal = '&nbsp;';
		html +=      		'<th>'+headerVal+'</th>';
				}
		html +=      	'</tr>';
			}
			else{
		html +=      	'<tr>';
		for(j= 0; j<cellLen; j++){
			var cellVal = trs[i].childNodes[j].textContent;
			if(j == 0){//디자인명
		html +=      		'<td width="30%">'+cellVal+'</td>';
			}
			if(j == 1){//원단명
		html +=      		'<td width="40%">'+cellVal+'</td>';
		}
			if(j == 2){//폭
		html +=      		'<td style="text-align: center;width:7%">'+cellVal+'</td>';
			}
			if(j == 3) {//절수
				if(cellVal.trim() == '') cellVal = 0;
		html += 			'<td style="text-align: center;width:8%">' + cellVal + '</td>';
				uSum += parseFloat(cellVal);
			}
			if(j == 4){//수량
				if(cellVal.trim() == '') cellVal = 0;
		html +=      		'<td width="15%" align="right">'+cellVal+'</td>';
				tSum += parseFloat(cellVal);
			}
		}
		html +=      	'</tr>';
			}
		}
		html +=      	'<tr>';//추가 tr for sum
		html +=				'<td colspan="2"></td>';
		html +=				'<td colspan="2" style="text-align: right;font-size: 16px"><strong>총절수</strong> : '+uSum+'</td>';
		html +=      		'<td width="100%" colspan="2" style="text-align: right;font-size: 16px"><strong>총수량</strong> : '+tSum+'</td>';
		html +=      	'</tr>';
		html +=		 '</table>';
		if(etc.dataVal || etc.dataVal.trim() != '') {//추가사항이 있으면
		html += 	 '<table cellpadding="0" cellspacing="0" width="100%" style="margin:43px 0 0 0">'//추가사항
		html += 	 	'<tr>';
		html += 			 '<td style="border-bottom:1px solid #000000"><strong>' + etc.colsName + '</strong></td>';
		html += 		 '</tr>';
		html += 		 '<tr>';
		html += 		 	'<td ' + etc.cls + ' style="padding-top:10px">' + etc.dataVal.replace(/\n/g, "<br />") + '</td>';
		html += 		 '</tr>';
		html += 	 '</table>';
		}
		//Acceptor
		html += 	 '<div style="border-bottom: 1px solid #000000;float:right;margin-top:43px ">';
		html +=      	'<span style="font-weight: bold;padding-right:25px">'+acceptor.colsName+' </span><span '+acceptor.cls+'>'+acceptor.dataVal+'</span>';
		html +=         '<span style="padding-left:27px">(인)</span>';
		html += 	 '</div>';
		html += '</div>';
		viewer.setHtml(html);
		viewer.fireEvent('formcomplete', viewer);
		var clientName;
		var fAddr, fTel, fFax, fMail, cAddr, cTel, cFax, cMail;
		Ext.data.JsonP.request({//거래처 정보 로드
			url : domain + '/json/view',
			params : {
				bd_idx : clientInfo.dataVal
			},
			success : function(response){
				var cValues = response.binderView;
				clientName = cValues.bd_subject;
				for(i=0; i<cValues.bd_data.length; i++) {
					if (cValues.bd_data[i].cols_code == 'address') {
						cAddr = cValues.bd_data[i].data_val;
						fAddr = cValues.bd_data[i].cols_name;
					}
					if (cValues.bd_data[i].cols_code == 'tel') {
						cTel = cValues.bd_data[i].data_val;
						fTel = cValues.bd_data[i].cols_name;
					}
					if (cValues.bd_data[i].cols_code == 'fax') {
						cFax = cValues.bd_data[i].data_val;
						fFax = cValues.bd_data[i].cols_name;
					}
					if (cValues.bd_data[i].cols_code == 'email') {
						cMail = cValues.bd_data[i].data_val;
						fMail = cValues.bd_data[i].cols_name;
					}
				}
				var cInfos = viewer.el.select('#customerInfo').elements[0];
				var cHtml = '<table width="100%" class="viewer-table">';
				cHtml     += 	'<tr><th colspan="2" align="left" style="border-bottom:1px solid #000000">'+clientInfo.colsName+'</th></tr>';
				cHtml     += 	'<tr><td colspan="2" align="left" style="font-size: 20px;font-weight:bold;height:37px">'+clientName+'</td></tr>';
				cHtml     += 	'<tr><td align="left" valign="top" style="width:80px;">'+fAddr+'</td><td>'+cAddr+'</td></tr>';
				cHtml     += 	'<tr><td align="left" valign="top">'+fTel+'</td><td>'+cTel+' <strong>&nbsp;&nbsp;&nbsp;팩스 </strong> '+cFax+'</td></tr>';
				cHtml     += '</table>';
				cInfos.innerHTML = cHtml;
			}
		});
	}	
});
