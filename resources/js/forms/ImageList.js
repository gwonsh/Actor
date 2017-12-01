Ext.define('resources.js.forms.ImageList', {
	singleton : true,
	CLASSNAME:'ImageList',
	getName:function(){
		return loc.viewer.imageList;
	},
	isNeedDataGroup:false,//data group을 미리 불러와 사용할지 여부 설정
	isForAnyCategory:true,//모든 카테고리에서 자동으로 사용 가능 여부 설정
	fileName:'imagelist.jpg',
	width:700,
	setHtml:function(values, viewer){
		var ctlr = getController('Viewer');
		var subjectAttr = ' class="basic-field" field_type="subject" bd_idx="'+values.bd_idx+'"';
		var contentAttr = ' class="basic-field" field_type="content" bd_idx="'+values.bd_idx+'"';
		var html;
		var i;
		html  = '<div class="viewer-frame imageList">';
		/* header */
        if (values.approvalList !== null && values.approvalList !== undefined && values.approvalList.length > 0 ) {
        html += '	<div  style="margin-left: 30px;float: right;height: 100%">';
            var apvLst = values.approvalList;
        html += '		<table cellpadding="0" cellspacing="0" border="1" class="approval-list" style="border-collapse: collapse;font-size: 12px;margin-bottom: 10px">';
        html += '			<tr>';
            for (i = 0; i < apvLst.length; i++) {
        html += '				<td height="20" width="45" align="center" title="' + apvLst[i].user_name + '">';
        html += apvLst[i].user_duty;
        html += '				</td>';
            }
        html += '			</tr>';
        html +=	'			<tr>';
            for (i = 0; i < apvLst.length; i++) {
        html += '				<td height="45" align="center" valign="middle" bdIdx="' + values.bd_idx + '" checked="' + apvLst[i].ap_chk + '" userid="' + apvLst[i].user_id + '" class="apvUnit">';
                if (apvLst[i].ap_chk == 1) {
        html += '					<img src="resources/images/ico_check.png">';
                }
        html += '				</td>';
            }
        html += '			</tr>';
        html += '			</table>';
        html += '	</div>';
        }
		//title
		var subject = values.bd_subject;
		if(subject === undefined) subject = '';
		html += '	<div style="width: 100%;height:45px">';
		html +=	'		<div style="float: left;width:100%;height:30px;font-size: 16px;font-weight: bold "' +subjectAttr+'>' + subject + '</div>';
		html += '	<div style="float;left;font-size:12px;width:100%;color:#555555;padding-bottom:10px">'
		html += 	Ext.util.Format.date(values.bd_regdate, 'Y/m/d')+' | '+values.bd_name+' | Data ID:' + values.bd_idx +'</div>';
		html += '</div>';

		/* attachment */
		var na = this;

		var files = [];
		if(values.bd_file.length > 0){
			files = values.bd_file;
		}
		else if(values.originalFiles !== undefined){
			files = values.originalFiles;
		}
		if (files.length > 0){
		html += '<div style="width:100%"  class="viewer-table section-space">';
			Ext.Array.each(files, function(entry, index){
				var tPath = entry.thumb_path.replace('/T', '');
				var mPath = entry.thumb_path.replace('/T', '/M');
				if(!Ext.isIE) tPath += '?c=' + randomString(16);
				var oPath = tPath.replace('thumb', 'file');//origial image(jpg) size path
				var dPath = 'binder/down/' + values.bd_idx + '/' + index;//original file download path
				var pixels = entry.file_height * entry.file_width;
				var sizeInFormat = ctlr.autoFilesizeFormat(entry.file_size);
				var resol = entry.file_width+'x'+entry.file_height;
				var attr = 'thumbSrc="'+tPath+'" viewSrc="'+oPath+'" downSrc="';
				attr += dPath+'" pixels="'+pixels+'" filesize="'+entry.file_size+'" resolution="'+resol+'" filename="'+entry.file_name+'"';
		html += '	<div style="float:left;width:100%">';
		html += '		<div style="width:100%;">';
		html += '			<img class="viewer-download-image" src="'+mPath+'" '+attr+' onload="getController(\'Viewer\').setImageSize(this, 650)">';
		html += '		</div>';
		html += '		<div style="float:left;width:100%">';
		html += 					entry.file_name +' / '+sizeInFormat;
		html += '		</div>';
		html += '	</div>';
		html += '	<div style="float:left;height:12px; width:100%"></div>';
			});
		html += '</div>';
		}
		
		//description
		var content = values.bd_content;
		if(content == undefined) content = '';
		html += '<div style="width: 100%;float: left" class="section-space">';
		html += '	<div style="float: left;font-weight:bold;padding-bottom:10px"><i class="fa fa-file-text-o"></i> '+loc.main.description.replace(':', '')+'</div>';
		html +=	'	<div style="float: left;width:100%;min-height:30px;font-size: 12px;padding:0 0 10px 0;"' +contentAttr+'>' + content + '</div>';
		html += '</div>';

		// custom fields
		if(values.bd_data.length > 0){
			var linkFields = [];
			var datasetFields = [];
		html += '<div style="width:100%;float:left" class="section-space">';
		html +=	'	<div style="float: left;font-weight:bold;width:100%;padding-bottom:10px"><i class="fa fa-info-circle"></i> '+loc.viewer.additionalInfo+'</div>';
		html +=	'	<table cellpadding=0 cellspacing=0" class="field-table" style="font-size: 12px">';
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
				var customAttr = ' class="custom-field" fieldIndex="'+index+'" render="'+fldOpt.render+'" bd_idx="'+values.bd_idx+'" unit="'+cUnit+'" dataVal="'+entry.data_val+'" cols_code="'+entry.cols_code+'"  cols_idx="'+entry.cols_idx+'" cols_name="'+entry.cols_name+'" cols_type="'+entry.cols_type + '"';
				if(ctlr.getDisableField(fldOpt)) customAttr = '';
				if(entry.cols_type == 'dataset'){
					var dsetHtml =	'<div style="float: left;font-weight:bold;padding-bottom:10px" class="section-space"><i class="fa fa-table""></i> '+entry.cols_name+'</div>';
						dsetHtml +=	'	<table border=0 cellpadding=0 cellspacing=0 class="viewer-table">';
						dsetHtml +=	'		<tr>';
						dsetHtml += '			<td colspan=2 style="padding:0">';
                        dsetHtml += getController('Viewer').getDatasetTable(viewer.colsList[index], customAttr);
						dsetHtml +=	'			</td>';
						dsetHtml +=	'		</tr>';
						dsetHtml += '	</table>';
					datasetFields.push(dsetHtml);
				}
				/* link field */
				else if(entry.cols_type == 'link'){
					var linkHtml = '<div style="width:100%;float:left;margin-top:30px" class="section-space">';
						linkHtml +=	'	<div style="float: left;font-weight:bold;padding-bottom:10px"><i class="fa fa-link"></i> '+entry.cols_name+'</div>';
	    				linkHtml +=	'		<table border=0 cellpadding=0 cellspacing=0 class="viewer-table">';
						linkHtml +=	'			<tr>';
						linkHtml += '				<td height=25 colspan=2 '+customAttr+'>';
					if(entry.data_val.length > 0){
						linkHtml += '					<div style="width:100%">';
						var ids = entry.data_val.split(',');
						Ext.Array.each(ids, function(item){
							var url = domain + '/thumb/' + item.trim() + '/0/T';

							var parameters = item.trim() + ',' + item.cols_name;
							var clickEvt = 'getController(\'Viewer\').showLinkInformation('+parameters+')';
						linkHtml +=	'						<div class="viewer-link-noline" onclick="'+clickEvt+'" cols_name="'+item.cols_name+'" bd_idx="'+item.trim()+'"';
						linkHtml += '							style="background:URL('+url+');background-repeat:no-repeat;background-position:center">';
						linkHtml += '						</div>';
						});
	   					linkHtml += '					</div>';
					}
						linkHtml +=	'				</td>';
						linkHtml +=	'			</tr>';
						linkHtml += '		</table>';
						linkHtml += '	</div>';
					linkFields.push(linkHtml);
				}
				/* end link field */
				/* color radio field */
				else if(entry.cols_type == 'colorchk'){
		html +=	'		<tr>';
		html +=	'			<th style="padding:3px 10px 3px 0;text-align: left;background-color: white">'+entry.cols_name+'</th>';
		html += '			<td  '+customAttr+'>';
					if(entry.data_val.length > 0){
		html += 					ctlr.getColorradio(entry.data_val);
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
		html +=	'			<th style="padding:3px 10px 3px 0;text-align: left;background-color: white">'+entry.cols_name+'</th>';
		html += '			<td  '+customAttr+'><div  style="width:15px;height:15px;background-color:'+entry.data_val+'"></div></td>';
		html +=	'		</tr>';
				}
				else if(entry.cols_type == 'color256'){
		html +=	'		<tr>';
		html +=	'			<th style="padding:3px 10px 3px 0;text-align: left;background-color: white">'+entry.cols_name+'</th>';
		html += '			<td  '+customAttr+'>';
						Ext.Array.each(entry.data_val.split(','), function(item){
		html += '				<div class="color256" style="float:left;width:15px;height:15px;background-color:'+item.trim()+'"></div>';
						});
		html += '			</td>';
		html += '		</tr>';
				}
				else if(entry.cols_type == 'datagrp'){
		html +=	'		<tr>';
		html +=	'			<th style="padding:3px 10px 3px 0;text-align: left;background-color: white">'+entry.cols_name+'</th>';
		html += '				<td  '+customAttr+' value="'+entry.data_val+'" relatedCategory="'+entry.cols_category+'">';
					if(entry.data_val ==='' || entry.data_val === undefined || entry.data_val === null){

					}
					else{
		html += '						<div style="float:left">'+entry.data_val+'</div>';
		html += '						<i class="fa fa-external-link" aria-hidden="true" value="'+entry.data_val+'" onclick="getController(\'Viewer\').showDataGroupInfomation(this)" relatedCategory="'+entry.cols_category+'" style="float:left;margin:2px 0 0 7px;cursor:pointer"></i>';
					}
		html +=	'			</td>';
		html +=	'		</tr>';
				}
				else{
					if(entry.cols_code == 'image'){
                        var imageSize = (entry.data_val === '')? '' : 'width:85px;height:85px;';
		html +=	'		<tr>';
		html += '			<th style="width:180px;padding:3px 10px 3px 0;text-align: left;background-color: white">' + entry.cols_name + '</th>';
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
		html += '			<th style="width:180px;padding:3px 10px 3px 0;text-align: left;background-color: white">' + entry.cols_name + '</th>';
		html += '			<td  ' + customAttr + '>' + cNames.join() + '</td>';
		html += '		</tr>'
					}
                    else if(entry.cols_code == 'percent' || fldOpt.render == 'percent'){
        html +='		<tr>';
        html +='			<th style="width:180px">' + entry.cols_name + '</th>';
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
					else if(entry.cols_code == 'checkedby') {

					}
					else{
						if(entry.data_val == '' || entry.cols_type == 'idx') cUnit = '';
		html +=	'		<tr>';
		html += '			<th style="width:180px;padding:3px 10px 3px 0;text-align: left;background-color: white">' + entry.cols_name + '</th>';
		html += '			<td  ' + customAttr + '>' + entry.data_val + cUnit + '</td>';
		html += '		</tr>';
					}
				}
			});
		html +=	'	</table>';
		html += '</div>';
		}

		Ext.Array.each(datasetFields, function(entry){
		html += entry;
		});
		Ext.Array.each(linkFields, function(entry){
		html += entry;
		});
		html += '<div style="height:40px;position:relative;clear:both"><div>';
		/* original attachment for clone category */
		if(values.originalFiles !== undefined){
			if(values.originalFiles.length > 0){
		html += '	<table border="1" cellpadding="0" cellspacing="0" style="float: left;border-collapse: collapse;width:100%;margin-top:-1px" class="information-table">';
		html += '		<tr>';
		html += '			<td style="background-color: white;font-size: 12px"><i class="fa fa-paperclip" aria-hidden="true"></i> '+values.originalCategoryName +' '+loc.main.attachFile;
		html += '			</td>';
		html += '		</tr>';
		html += '		<tr>';
		html += '			<td style="background-color: white">';
		html += '				<div style="width:100%">';
			Ext.Array.each(values.originalFiles, function(entry, index){
				var tPath = entry.thumb_path;
				if(!Ext.isIE) tPath += '?c=' + randomString(16);
				var oPath = tPath.replace('thumb', 'file');//origial image(jpg) size path
				var dPath = 'binder/down/' + values.bd_idx + '/' + index;//original file download path
				var pixels = entry.file_height * entry.file_width;
				var sizeInFormat = ctlr.autoFilesizeFormat(entry.file_size);
				var resol = entry.file_width+'x'+entry.file_height;
				var backSize = 'contain';
				var isImage = getController('Config').isImage(entry);
				if(!isImage) backSize = 'auto';
				var brdWidth = '120px', brdHeight = '120px';
				if(entry.file_width == 0) {
                    backSize = 'inherit';
                }
				var attr = 'thumbSrc="'+tPath+'" viewSrc="'+oPath+'" downSrc="';
				attr += dPath+'" pixels="'+pixels+'" filesize="'+entry.file_size+'" resolution="'+resol+'" filename="'+entry.file_name+'"';
		html += '					<div class="viewer-attach-unit"  style="background-color: white;width:'+brdWidth+';float: left;margin: 0 5px 5px 0; cursor: pointer">';
		html += '						<div style="background-image:url('+tPath+');background-size:'+backSize+'" '+attr+' class="viewer-download-image  viewer-attach-image"></div>';
		html += '						<div class="viewer-filename" title="'+entry.file_name+'">';
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
		}		
		html += '</div>';

		viewer.setHtml(html);
		viewer.setHidden(false);
		viewer.fireEvent('formcomplete', viewer);
	}
});