Ext.define('resources.js.forms.SimpleList', {
	singleton : true,
	CLASSNAME:'SimpleList',
	getName:function(){
		return loc.viewer.simpleList;
	},
	isNeedDataGroup:false,//data group을 미리 불러와 사용할지 여부 설정
	isForAnyCategory:true,//모든 카테고리에서 자동으로 사용 가능 여부 설정
	fileName:'simplelist.jpg',
    width:700,
	setHtml:function(values, viewer){
		var baseColor = '#ffffff';
		var spacer = '<div style="float:right;width:1px;height:100%;margin:3px 0 3px 10px;background-color:#333333"></div>';
		spacer = '<div style="position:absolute;bottom:0;right:0px;width:1px;height:16px;background-color:#333333"></div>';
		var ctlr = getController('Viewer');
		var subjectAttr = ' class="basic-field simpleList" field_type="subject" bd_idx="'+values.bd_idx+'"';
		var contentAttr = ' class="basic-field simpleList" field_type="content" bd_idx="'+values.bd_idx+'"';
		var html;
		var headerHeight = '68px';
		if(!values.approvalList){
			headerHeight = '';
		}
		html  = '<div class="viewer-frame" style="min-width: 550px;padding:25px 25px 0px 25px">';
		html += '	<div style="width:100%;height:'+headerHeight+'">';
        if (values.approvalList !== null && values.approvalList !== undefined && values.approvalList.length > 0 ) {
        html += '		<div  style="margin-left: 30px;float: right;height: 100%">';
            var apvLst = values.approvalList;
        html += '			<table cellpadding="0" cellspacing="0" border="1" class="approval-list" style="border-collapse: collapse;font-size: 12px;margin-bottom: 10px">';
        html += '				<tr>';
            for (i = 0; i < apvLst.length; i++) {
        html += '					<td height="20" width="45" align="center" title="' + apvLst[i].user_name + '">';
        html += apvLst[i].user_duty;
        html += '					</td>';
            }
        html += '				</tr>';
        html +=					'<tr>';
            for (i = 0; i < apvLst.length; i++) {
        html += '					<td height="45" align="center" valign="middle" bdIdx="' + values.bd_idx + '" checked="' + apvLst[i].ap_chk + '" userid="' + apvLst[i].user_id + '" class="apvUnit">';
                if (apvLst[i].ap_chk == 1) {
        html += '						<img src="resources/images/ico_check.png">';
                }
        html += '					</td>';
            }
        html += '				</tr>';
        html += '			</table>';
        html += '		</div>';
        }
		html +=	'		<div style="float:right;font-size:12px;">';
		html +=	'			<div style="text-align:right">' + loc.main.user + ': ' +values.bd_name+'</div>';
		html +=	'			<div style="text-align:right;padding:0 0 5px 0">'+loc.main.regDate+': '+values.bd_regdate+', Data ID:'+values.bd_idx+'</div>';
		html += '		</div>';
		html +=	'	</div>';
		/* category name */
		html += '	<div style="width:100%;height:45px;border-bottom:2px solid #000;background-color:'+baseColor+'">';
		if(values.bd_colortag !== ''){
		html += '		<div style="float:left;width:10px;height:25px;margin-top:4px;background-color:'+values.bd_colortag+'"></div>';
		}
		html += '			<span class="label-left-space" style="margin-left:10px;font-size:25px;line-height:150%;color:black;font-weight:bold">'+viewer.title+'</span>';
		html += '		</div>';
		html += '		<table cellpadding="6" cellspacing="0" width="100%">';
		
		var subject = values.bd_subject;
		if(values.bd_subject == '') subject = '';
		html +=	'			<tr>';
		html +=	'				<th style="position:relative;width:22%;text-align:right" class="simpleList">'+values.subjectTitle+spacer+'</th>';
	
		html +=	'				<td '+subjectAttr+' style="width:78%">' + subject + '</td>';
		html +=	'			</tr>';
		Ext.Array.each(values.bd_data, function(entry, index){
            var fldOpt = getOption((viewer.colsList[index].cols_option));
            if(fldOpt.render == 'image') entry.cols_code = 'image';
            if(entry.cols_type == 'number' && fldOpt.numberFormat != undefined){
                if(entry.data_val.indexOf(',') == -1) entry.data_val = Ext.util.Format.number(entry.data_val, fldOpt.numberFormat);
            }
            if(ctlr.getHideField(fldOpt)) return;
			var cUnit = entry.cols_unit;
			if(cUnit === undefined) cUnit = '';
			if(cUnit !== ''){
				if(entry.cols_type == 'check'){
					cUnit = '(' + cUnit + ')';
				}
			}
			else{
				if(entry.cols_code == 'percent' || fldOpt.render == 'percent'){
					cUnit = '%';
				}
			}
		var customAttr = ' class="custom-field simpleList" fieldIndex="'+index+'" render="'+fldOpt.render+'" bd_idx="'+values.bd_idx+'" unit="'+cUnit+'" dataVal="'+entry.data_val+'" cols_code="'+entry.cols_code+'" cols_idx="'+entry.cols_idx+'" cols_name="'+entry.cols_name+'" cols_type="'+entry.cols_type + '"';
		if(ctlr.getDisableField(fldOpt)) customAttr = '';
		if(entry.cols_type == 'dataset'){
		html +=	'			<tr>';
		html +=	'				<th style="position:relative;text-align:right" class="simpleList">'+entry.cols_name+spacer+'</th>';
		html += '				<td >'+getController('Viewer').getDatasetTable(viewer.colsList[index], customAttr);+'</td>';
		html +=	'			</tr>';
		}
			/* link field */
		else if(entry.cols_type == 'link'){
		html +=	'			<tr>';
		html +=	'				<th style="position:relative;text-align:right" class="simpleList">'+entry.cols_name+spacer+'</th>';
		html += '					<td height=23 '+customAttr+'>';
		if(entry.data_val.length > 0){
		html += '						<div style="width:100%">';
		var ids = entry.data_val.split(',');
		Ext.Array.each(ids, function(item){
		var url = domain + '/thumb/' + item.trim() + '/0/T';
		var parameters = item.trim() + ',' + item.cols_name;
		var clickEvt = 'getController(\'Viewer\').showLinkInformation('+parameters+')';
		html +=	'						<div class="viewer-link" onclick="'+clickEvt+'" cols_name="'+item.cols_name+'" bd_idx="'+item.trim()+'"';
		html += '						style="float:left;width:100px;height:100px;margin-right:5px;background:URL('+url+');background-repeat:no-repeat;background-position:center">';
		html += '					</div>';
		});
		html += '				</div>';
			}
		html += '			</td>';
		html +=	'		</tr>';
		}
		/* end link field */
		/* color radio field */
		else if(entry.cols_type == 'colorchk'){
		html += '		<tr>';
		html +=	'			<th style="position:relative;text-align:right" class="simpleList">'+entry.cols_name+spacer+'</th><td '+customAttr+' class="simpleList">';
			if(entry.data_val.length > 0){
		html += ctlr.getColorradio(entry.data_val);
			}
		html += '			</td>';
		html +=	'		</tr>';
		}
		else if(entry.cols_type == 'url'){
			html +=	'		<tr>';
			html +=	'			<th>'+entry.cols_name+'</th>';
			html += '			<td  '+customAttr+'>';
			var urlLink;
			if(entry.data_val.indexOf('http://') == -1){
				urlLink = 'http://' + entry.data_val;
			}
			else{
				urlLink = entry.data_val;
			}
			html += 			'<a href="#" onclick="window.open(\''+urlLink+'\',\''+entry.cols_name+'\')">' + loc.viewer.open + '</a>';
			html += '			</td>';
			html +=	'		</tr>';
		}
		/* end color radio field */
		else if(entry.cols_type == 'color'){
		html +=	'		<tr>';
		html +=	'			<th style="position:relative;text-align:right" class="simpleList">'+entry.cols_name+spacer+'</th>';
		html += '			<td  '+customAttr+'><div  style="width:15px;height:15px;background-color:'+entry.data_val+'"></div></td>';
		html +=	'		</tr>';
		}
		else if(entry.cols_type == 'color256'){
		html +=	'		<tr>';
		html +=	'			<th style="position:relative;text-align:right" class="simpleList">'+entry.cols_name+spacer+'</th>';
		html += '			<td  '+customAttr+'>';
		Ext.Array.each(entry.data_val.split(','), function(item){
		html += '				<div class="color256" style="float:left;width:15px;height:15px;background-color:'+item.trim()+'"></div>';
		});
		html += '			</td>';
		html +=	'		</tr>';
		}
		/* datagroup field */
		else if(entry.cols_type == 'datagrp'){
		html +=	'		<tr>';
		html +=	'			<th style="position:relative;text-align:right" class="simpleList">'+entry.cols_name+spacer+'</th>';
		html += '			<td  '+customAttr+' value="'+entry.data_val+'" relatedCategory="'+entry.cols_category+'">';
			if(entry.data_val ==='' || entry.data_val === undefined || entry.data_val === null){

			}
			else{
		html += '				<div style="float:left">'+entry.data_val+'</div>';
		html += '				<i class="fa fa-external-link" aria-hidden="true" value="'+entry.data_val+'" onclick="getController(\'Viewer\').showDataGroupInfomation(this)" relatedCategory="'+entry.cols_category+'" style="float:left;margin:2px 0 0 7px;cursor:pointer"></i>';
			}
		html +=	'			</td>';
		html +=	'		</tr>';
		}

		else{
			if(entry.cols_code == 'image'){
				var imageSize = (entry.data_val === '')? '' : 'width:85px;height:85px;';
		html +=	'		<tr>';
		html += '			<th style="position:relative;text-align: right;width:180px"  class="simpleList">' + entry.cols_name +spacer+ '</th>';
		html += '			<td  ' + customAttr + ' imgSrc="'+entry.data_val+'">';
                if(entry.data_val != '') {
        html += '				<img style="max-height: 85px;cursor: pointer" src="' + entry.data_val + '" onerror="this.src =\'resources/images/ico_broken.png\'" onclick="getController(\'Viewer\').viewImage(this)">'
                }
		html += '			</td>';
		html += '		</tr>';
			}
			else if(entry.cols_code == 'linked'){
				var arr = entry.data_val.split('，');
				var cNames = [];
				for(i=0; i<arr.length; i++){
					cNames.push(arr[i].split('＠')[0]);
				}
		html +=	'		<tr>';
		html += '			<th style="position:relative;text-align:right;width:180px"  class="simpleList">' + entry.cols_name +spacer+ '</th>';
		html += '			<td  ' + customAttr + '>' + cNames.join() + '</td>';
		html += '		</tr>';
			}
            else if(entry.cols_code == 'percent' || fldOpt.render == 'percent'){
        html +='		<tr>';
        html +='			<th style="width:180px"  class="simpleList">' + entry.cols_name +spacer+ '</th>';
        html +='			<td ' + customAttr + '>';
        html +=			entry.data_val+cUnit;
        html +='			</td>';
        html +='		</tr>';
            }
            else if(entry.cols_code == 'colorHex' || fldOpt.render == 'colorHex'){
        html +='		<tr>';
        html +='			<th style="width:180px">' + entry.cols_name + '</th>';
                if(viewer.hasRGB){//수정 금지
                    customAttr = ' fieldIndex="'+index+'" render="'+fldOpt.render+'"  bd_idx="'+values.bd_idx+'" unit="'+cUnit+'" dataVal="'+entry.data_val+'" cols_code="'+entry.cols_code+'" cols_idx="'+entry.cols_idx+'" cols_name="'+entry.cols_name+'" cols_type="'+entry.cols_type + '"';
        html += '			<td ' + customAttr + '>';
                }
                else{//수정가능
        html += '			<td ' + customAttr + '>';
                }
        html +='				<div style="float: left;width: 30px;height:20px;border:1px solid #cccccc: ;background-color: '+entry.data_val+';"></div>';
        html += '				<span style="float: left;margin-left: 8px">' + entry.data_val + '</span>';
        html +='			</td>';
        html +='		</tr>';
			}
            else if(entry.cols_code == 'getColors'){
                var colors = getController('Config').getColorChips(eval(entry.data_val));
        html +='        <tr>';
        html +='			<th style="width:180px"  class="simpleList">' + entry.cols_name +spacer+ '</th>';
        html +='        	<td style="border-bottom:1px solid #000">' + colors;
        html +='        	</td>';
        html +='        </tr>';
            }
			else if(entry.cols_code == 'checkedby') {

			}
			else{
				if(entry.data_val == '' || entry.cols_type == 'idx') cUnit = '';
		html +=	'		<tr>';
		html += '			<th style="position:relative;text-align:right;width:180px"  class="simpleList">' + entry.cols_name +spacer+ '</th>';
		html += '			<td  ' + customAttr + '>' + entry.data_val + cUnit + '</td>';
		html += '		</tr>';
			}
		}
		});	
		var remark = values.bd_content;
		if(remark === undefined) remark = '';
		html +=	'		<tr>';
		html += '			<th class="simpleList" style="position:relative;text-align:right">'+loc.main.description+spacer+'</th><td height=25 '+contentAttr+' colspan=4>'+remark+'</td>';
		html +=	'		</tr>';
		html += '	</table>';
		
		/* original attachment for clone category */
		if(values.originalFiles !== undefined && values.originalFiles.length > 0){
		html += '	<table cellpadding=0 cellspacing=0 class="viewer-table section-space" style="margin-left: 10px;width: 100%;border-collapse: collapse;font-size: 13px">';
		html += '		<tr><td style="padding:3px;border-bottom:1px solid #333333">'+values.originalCategoryName +' '+loc.main.attachFile+'</td></tr>';
		html += '		<tr>';
		html +=	'			<td>';
		html += '				<div style="width:100%;padding-top:10px">';
		Ext.Array.each(values.originalFiles, function(entry, index){
			var tPath = entry.thumb_path;
			if(!Ext.isIE) tPath += '?c=' + randomString(16);
			var oPath = tPath.replace('thumb', 'file');//origial image(jpg) size path
			var dPath = 'binder/down/' + values.bd_idx + '/' + index;//original file download path
			var pixels = entry.file_height * entry.file_width;
			var sizeInFormat = ctlr.autoFilesizeFormat(entry.file_size);
			var resol = entry.file_width+'x'+entry.file_height;
			//var backSize = (entry.file_height < 120 && entry.file_width < 120)? 'auto' : 'cover';
			var backSize = 'contain';
			var isImage = getController('Config').isImage(entry);
			if(!isImage) backSize = 'auto';
			if(entry.file_width == 0){
				backSize = 'auto';
			}
			var attr = 'thumbSrc="'+tPath+'" viewSrc="'+oPath+'" downSrc=""';
				attr += dPath+'" pixels="'+pixels+'" filesize="'+entry.file_size+'" resolution="'+resol+'" filename="'+entry.file_name+'"';
		html += '					<div class="viewer-attach-unit-very-small">';
		html += '						<div style="background-image:url('+tPath+');background-size:'+backSize+'" '+attr+' class="viewer-download-image viewer-attach-image-small"></div>';
		html += '						<div class="viewer-filename" title="'+entry.file_name+'" style="overflow:hidden;font-size:11px;height:13px;text-align:center">';
		html += 							entry.file_name;
		html += '						</div>';
		html += '						<div class="viewer-filename">'+sizeInFormat+'</div>';
		html += '					</div>';
		});
		html += '				</div>';
		html += '			</td>';
		html +=	'		</tr>';
		html += '	</table>';
		}		
		
		/* attachment */
		if(values.bd_file.length > 0){
			var attachTitle = (values.originalFiles !== undefined)?  viewer.title + ' ' + loc.main.attachFile : loc.main.attachFile;
		html += '	<table cellpadding=0 cellspacing=0 class="viewer-table section-space" style="margin-left: 10px;width: 100%;border-collapse: collapse;font-size: 13px">';
		html += '		<tr><td style="padding:3px;border-bottom:1px solid #333333">'+attachTitle+'</td></tr>';
		html += '		<tr>';
		html +=	'			<td>';
		html += '				<div style="width:100%;padding-top:10px">';
		Ext.Array.each(values.bd_file, function(entry, index){
			var tPath = entry.thumb_path;
			if(!Ext.isIE) tPath += '?c=' + randomString(16);
			var oPath = tPath.replace('thumb', 'file');//origial image(jpg) size path
			var dPath = 'binder/down/' + values.bd_idx + '/' + index;//original file download path
			var pixels = entry.file_height * entry.file_width;
			var sizeInFormat = ctlr.autoFilesizeFormat(entry.file_size);
			var resol = entry.file_width+'x'+entry.file_height;
			//var backSize = (entry.file_height < 120 && entry.file_width < 120)? 'auto' : 'cover';
			var backSize = 'contain';
			var isImage = getController('Config').isImage(entry);
			if(!isImage) backSize = 'auto';
			if(entry.file_width == 0){
				backSize = 'auto';
			}
			var attr = 'thumbSrc="'+tPath+'" viewSrc="'+oPath+'" downSrc=""';
				attr += dPath+'" pixels="'+pixels+'" filesize="'+entry.file_size+'" resolution="'+resol+'" filename="'+entry.file_name+'"';
		html += '					<div class="viewer-attach-unit-very-small">';
		html += '						<div style="background-image:url('+tPath+');background-size:'+backSize+'" '+attr+' class="viewer-download-image viewer-attach-image-small"></div>';
		html += '						<div class="viewer-filename" title="'+entry.file_name+'" style="overflow:hidden;font-size:11px;height:13px;text-align:center">';
		html += 							entry.file_name;
		html += '						</div>';
		html += '						<div class="viewer-filename">'+sizeInFormat+'</div>';
		html += '					</div>';
		});
		html += '				</div>';
		html += '			</td>';
		html +=	'		</tr>';
		html += '	</table>';
		}
		html +=	'	<div class="viewer-header" style="width:100%;height:65px;background-color:white;padding-top:10px;border-top:2px solid #333333 ">';
		if(values.companyInfo !== undefined){
		html += '		<img src="'+values.companyInfo.company_logo+'" class="viewer-logo">';
		html += '		<div style="float:left;height:100%;margin-left:10px">';
		html += '			<div class="viewer-companyname" style="margin-top: 5px;font-size: 15px;font-weight:bold">'+ values.companyInfo.company_name +'</div>';
		html += '			<div class="viewer-addr" style="max-width: 200px;font-size: 12px">'+ values.companyInfo.company_addr1 + ' ' + values.companyInfo.company_addr2 +'</div>';
		html += '		</div>';
		}
		html +=  '	</div>';
		html += '</div>';
		viewer.setHtml(html);
		viewer.setHidden(false);
		viewer.fireEvent('formcomplete', viewer);
	}
});