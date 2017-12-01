Ext.define('resources.js.forms.Quotation', {
	singleton : true,
	CLASSNAME:'Quotation',
	getName:function(){
		return loc.viewer.invoice;
	},
	isForAnyCategory:false,//모든 카테고리에서 자동으로 사용 가능 여부 설정
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
		html =  '<div class="viewer-frame" style="font-size:13px">';
		html +=	'	<div class="viewer-header" style="padding-top:10px;height:90px">';
		if(values.companyInfo !== undefined){
		html += '		<div style="float:left;height:100%;margin-left:10px">';
			var compInfo = values.companyInfo.company_addr1 + ' ' + values.companyInfo.company_addr2 + '<br>TEL: ' + values.companyInfo.company_phone;
			compInfo += ', FAX:' + values.companyInfo.company_fax;
		html += '			<div class="viewer-companyname-big">'+ values.companyInfo.company_name +'</div>';
		html += '			<div class="viewer-addr" style="margin-top: 7px">'+ compInfo +'</div>';
		html += '		</div>';
		html += '		<img src="'+values.companyInfo.company_logo+'" class="viewer-logo" style="float:right">';
		}
		html += '	</div>';
		html += '	<div style="width:100%;height:'+headerHeight+'">';
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
		html += '		<div class="viewer-approval">';
		html +=	'			<table cellpadding="0" cellspacing="0" border="1" class="approval-list">';
		html += '				<tr>';
			for(i=0; i<apvLst.length; i++){
		html += '					<td height="20" width="45" align="center" title="'+apvLst[i].user_name+'">';
		html +=                    		 apvLst[i].user_duty;
		html += '					</td>';
			}
		html += '				</tr>';
		html +=	'				<tr>';
			for(i=0; i<apvLst.length; i++){
		html += '					<td height="45" align="center" valign="middle" bdIdx="'+values.bd_idx+'" checked="'+apvLst[i].ap_chk+'" userid="'+apvLst[i].user_id+'" class="apvUnit">';
				if(apvLst[i].ap_chk == 1){
		html += '						<img src="resources/images/ico_check.png">';
				}
		html += '					</td>';
			}
		html += '					</tr>';
		html +=	'				</table>';
		html += '			</div>';
		}
		html +=	'		</div>';

		var dtVal, ivcNo, proList, etc, curSign, colsClass, clientInfo, consignee, needVat, payment, attn;
		var headerHtml = '';
		for(i=0; i<values.bd_data.length; i++){
			colsClass = ' class="custom-field" fieldIndex="'+ i.toString()+'" bd_idx="'+values.bd_idx+'" cols_idx="'+values.bd_data[i].cols_idx+'" cols_name="'+values.bd_data[i].cols_name+'" cols_type="'+values.bd_data[i].cols_type + '"';
			if(values.bd_data[i].cols_code == 'issue_date'){//날짜
				dtVal = {dataVal:values.bd_data[i].data_val, colsName:values.bd_data[i].cols_name, cls:colsClass};
			}
			if(values.bd_data[i].cols_code == 'issue_id'){//id
				ivcNo = {dataVal:values.bd_data[i].data_val, colsName:values.bd_data[i].cols_name};
			}
			if(values.bd_data[i].cols_code == 'payment'){//id
				payment = {dataVal:values.bd_data[i].data_val, colsName:values.bd_data[i].cols_name, cls:colsClass};
			}
			if(values.bd_data[i].cols_code == 'attn'){//id
				attn = {dataVal:values.bd_data[i].data_val, colsName:values.bd_data[i].cols_name, cls:colsClass};
			}
			if(values.bd_data[i].cols_code == 'item_list'){//제품목록
				proList = {dataVal:values.bd_data[i].data_val, dataHtml:values.bd_data[i].data_html, colsName:values.bd_data[i].cols_name, cls:colsClass};
			}
			if(values.bd_data[i].cols_code == 'issue_options'){//기타사항
				var customAttr = ' class="custom-field" fieldIndex="'+i+'" bd_idx="'+values.bd_idx+'" cols_idx="'+values.bd_data[i].cols_idx+'" cols_name="'+values.bd_data[i].cols_name+'" cols_type="'+values.bd_data[i].cols_type + '"';
				etc = {dataVal:values.bd_data[i].data_val, colsName:values.bd_data[i].cols_name, cls:colsClass, attr:customAttr};
			}
			if(values.bd_data[i].cols_idx == 156){//돈 표시
				curSign = values.bd_data[i].data_val;
			}

			if(values.bd_data[i].cols_code == 'client_datagrp'){
				//지정된 거래처 정보(데이터그룹필드)
				clientInfo = {dataVal:values.bd_data[i].data_val.split('||')[0], colsName:values.bd_data[i].cols_name, cls:colsClass};
			}
			if(values.bd_data[i].cols_code == 'consignee'){
				consignee = values.bd_data[i].data_val;
			}
			if(values.bd_data[i].cols_code == 'vat'){
				needVat = {dataVal:values.bd_data[i].data_val, colsName:values.bd_data[i].cols_name};
			}
			if(!ivcNo) ivcNo = '';
		}

		if(clientInfo === undefined){
			//alert('폼을 사용하기 위한 구성 요소가 없습니다. 데이터그룹 필드(fieldcode:client_datagrp)가 필요합니다.');
			return;
		}

		if(!curSign) curSign = '￦';

		/* Invoice ID*/
		html += '	<div style="width:100%;height:60px;border-bottom:2px solid #000;margin-top:25px;background-color:'+baseColor+'">';
		if(values.bd_colortag !== ''){
		html += '		<div style="float:left;width:10px;height:25px;margin-top:4px;background-color:'+values.bd_colortag+'"></div>';
		}
		html += '			<span style="font-size:40px;line-height:150%;color:black;font-weight:bold">'+viewer.title+'</span>';
		html += '		</div>';

		html +=	'		<table cellpadding=2" cellspacing="0" width="100%" style="border-bottom: 1px solid #333333;margin-top: 8px">';
		html += '			<tr>';//Issue date
		html += '				<td width="100" style="font-weight: 600">'+dtVal.colsName +'</td><td>'+dtVal.dataVal+'</td>';
		html += '			</tr>';
		html += '			<tr>';
		html += '				<td style="font-weight: 600">'+ivcNo.colsName+'</td><td>'+ivcNo.dataVal+'</td>';
		html += '			</tr>';
		html += '			<tr>';
		html += '				<td style="font-weight: 600">'+payment.colsName+'</td><td>'+payment.dataVal+'</td>';
		html += '			</tr>';
		html += '			<tr>';
		html += '				<td style="font-weight: 600">'+attn.colsName+'</td><td>'+attn.dataVal+'</td>';
		html += '			</tr>';
		html += '			<tr>';
		html += '				<td id="customerInfo"'+clientInfo.cls+' colSpan="2">';//customer info
		html += '				</td>';
		html += '			</tr>';
		html +=	'		</table>';

		var parser = new DOMParser();
		//var doc = parser.parseFromString(proList.dataHtml, "text/xml");
		var htmldiv = document.createElement("div");
		htmldiv.innerHTML = proList.dataHtml;
		htmldiv.setAttribute("class", "testhtml");

		var trs = Ext.get(Ext.get(htmldiv)).el.select('tr').elements;
		var tSum = 0;
		html += '		<div style="height:14px"></div>';
		html +=	'		<table style="margin-top10px;border-collapse: collapse " border="1" cellpadding="6" cellspacing="0" width="100%" '+proList.cls+'>';
		for(i=0; i<trs.length; i++){//header of dataset table
			if(i==0){//for the first column(header)
		html += '			<tr>';
				for(j= 0; j<trs[i].childNodes.length; j++){
		html += '				<th>'+trs[i].childNodes[j].textContent+'</th>';
				}
		html += '				<th>합계</th>';
		html += '			</tr>';
			}
			else{
		html += '			<tr>';
		var mSum = 0;
		for(j= 0; j<trs[i].childNodes.length; j++){
			if(trs[i].childNodes[j].textContent == '&nbsp;'){
				trs[i].childNodes[j].textContent = '';
			}
			if(j == 0){//품목
		html += '				<td width="20%">'+trs[i].childNodes[j].textContent+'</td>';
			}
			if(j == 1){//설명
		html += '				<td width="30%">'+trs[i].childNodes[j].textContent+'</td>';
		}
			if(j == 2){//수량
				mSum = parseInt(trs[i].childNodes[j].textContent);
		html += '				<td style="text-align: right;width:8%">'+trs[i].childNodes[j].textContent+'</td>';
			}
			if(j == 3) {//단가
				mSum *= parseInt(trs[i].childNodes[j].textContent);
		html += '				<td style="text-align: right;width:12%">' + Ext.util.Format.currency(trs[i].childNodes[j].textContent, curSign, 0) + '</td>';
			}
			if(j == 4){//함계
		html += '				<td width="15%">'+trs[i].childNodes[j].textContent+'</td>';
			}
		}
		tSum += mSum;

		html += '				<td style="text-align: right" width="15%">'+Ext.util.Format.currency(mSum, curSign, 0)+'</td>';
		html += '			</tr>';
			}
		}
		var vatInfo = '';//부가세 정보
		if(needVat.dataVal.toLowerCase() == 'yes'){
			vatInfo = '('+needVat.colsName+')';
		}
		html += '			<tr>';
		html += '				<td width="100%" colspan="5" style="text-align: right;font-size: 16px"><strong>총합계</strong> : '+Ext.util.Format.currency(tSum, curSign, 0)+vatInfo+'</td>';
		html += '			</tr>';
		html +=	'		</table>';
		html +=	'		<table cellpadding="6" cellspacing="0" width="100%" style="margin-top:23px;">'
		html +=	'			<tr>';
		html +=	'				<td><strong>'+etc.colsName+'</strong></td>';
		html +=	'			</tr>';
		html +=	'			<tr>';
		html +=	'			<td style="border:1px solid #000;min-height:40px"'+etc.attr+'>'+etc.dataVal.replace(/\n/g, "<br />")+'</td>';
		html +=	'			</tr>';
		html +=  '		</table>';
		html += '	</div>';

		viewer.setHtml(html);
		viewer.setHidden(false);
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
				var cHtml = '<table width="100%">';
				cHtml     += '<tr><th colspan="2" align="left" style="border-bottom:1px solid #000000"><strong>'+clientInfo.colsName+'</strong></th></tr>';
				cHtml     += '<tr><th colspan="2" align="left" style="font-size: 20px;height:37px">'+clientName+'</th></tr>';
				cHtml     += '<tr><th align="left" valign="top" style="width:90px;">'+fAddr+'</th><td>'+cAddr+'</td></tr>';
				cHtml     += '<tr><th align="left" valign="top">'+fTel+'</th><td>'+cTel+' <strong>&nbsp;&nbsp;&nbsp;팩스 </strong> '+cFax+'</td></tr>';
				cHtml     += '</table>';
				cInfos.innerHTML = cHtml;
			}
		});
	}	
});