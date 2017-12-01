Ext.define('resources.js.forms.Gallery', {
	singleton : true,
	CLASSNAME:'Gallery',
	getName:function(){
		return loc.viewer.gallery;
	},
	fileName:'gallery.jpg',
	width:700,
	setHtml:function(values, viewer){
		var ctlr = getController('Viewer');
		var subjectAttr = ' class="basic-field" field_type="subject" bd_idx="'+values.bd_idx+'"';
		var contentAttr = ' class="basic-field" field_type="content" bd_idx="'+values.bd_idx+'"';
		var html;
		html  =  '<div class="viewer-frame form-gallery" style="padding: 25px 25px 0 25px;margin-top:20px">';
		var path;
        if (values.approvalList !== null && values.approvalList !== undefined && values.approvalList.length > 0 ) {
         html += '	<div  style="position:absolute;right: 25px; top: 0;">';
            var apvLst = values.approvalList;
         html += '		<table cellpadding="0" cellspacing="0" border="1" class="approval-list" style="border-collapse: collapse;font-size: 12px;margin-bottom: 10px">';
         html += '			<tr>';
            for (i = 0; i < apvLst.length; i++) {
         html += '				<td height="20" width="45" align="center" title="' + apvLst[i].user_name + '">';
         html += apvLst[i].user_duty;
         html += '				</td>';
            }
         html += '			</tr>';
         html += '          <tr>';
            for (i = 0; i < apvLst.length; i++) {
         html += '				<td height="45" align="center" valign="middle" bdIdx="' + values.bd_idx + '" checked="' + apvLst[i].ap_chk + '" userid="' + apvLst[i].user_id + '" class="apvUnit">';
                if (apvLst[i].ap_chk == 1) {
         html += '					<img src="resources/images/ico_check.png">';
                }
         html += '				</td>';
            }
         html += '			</tr>';
         html += '		</table>';
         html += '	</div>';
        }
		if(values.bd_file[0]){
			path = values.bd_file[0].thumb_path.replace('/T', '/M');
		}
		else if(values.originalFiles !== undefined){
			path = values.originalFiles[0].thumb_path.replace('/T', '/M');
		}
		else{
			path = 'resources/images/ico_noimage.gif';
		}
		/* category name */
		html += '	<div style="font-size:20px;font-weight:bold;padding-bottom:10px">';
		if(values.bd_colortag !== ''){
			html += 	 '<div style="float:left;width:10px;height:100%;background-color:'+values.bd_colortag+'"></div>';
		}
		html += '		<span class="label-left-space">'+viewer.title+'</span>';
		html += '	</div>';
		/* image */
		html += '	<div style="width:100%;height:500px;background-image:url('+path+');background-color:#f5f5f5" class="div-image"></div>';
		
		/* attachment */
		var firstFileName = '';
		if(values.bd_file.length ===0 && values.originalFiles !== undefined){
			firstFileName = values.originalFiles[0].file_name.split('.')[0];
		}		
		if(values.bd_file.length > 0){
			var attachTitle = (values.originalFiles !== undefined)?  viewer.title + ' ' + loc.main.attachFile : loc.main.attachFile;
		html += '	<table cellpadding=0 cellspacing=0 style="margin-top: 20px">';
		html += '		<tr><th style="text-align: left">'+attachTitle+'</th></tr>';
		html += '		<tr>';
		html +=	'			<td>';
		html += '				<div style="width:100%;">';
		Ext.Array.each(values.bd_file, function(entry, index){
			if(index == 0){
				firstFileName = entry.file_name.split('.')[0];
			}
		var tPath = entry.thumb_path.replace('/T', '');
		if(!Ext.isIE) tPath += '?c=' + randomString(16);
		var oPath = tPath.replace('thumb', 'file');//origial image(jpg) size path
		var dPath = 'binder/down/' + values.bd_idx + '/' + index;//original file download path
		var pixels = entry.file_height * entry.file_width;
		var sizeInFormat = ctlr.autoFilesizeFormat(entry.file_size);
		var resol = entry.file_width+'x'+entry.file_height;
		var backSize = (entry.file_height < 80 && entry.file_width < 80)? 'auto' : 'cover';
		var attr = 'thumbSrc="'+tPath+'" viewSrc="'+oPath+'" downSrc="';
			attr += dPath+'" pixels="'+pixels+'" filesize="'+entry.file_size+'" resolution="'+resol+'" filename="'+entry.file_name+'"';
		html += '					<div style="float:left;width:80px;margin-right:5px;cursor:pointer">';
		html += '						<div style="background-image:url('+tPath+');background-size:'+backSize+';height:80px" '+attr+' class="viewer-download-image viewer-attach-image"></div>';
		html += '						<div class="viewer-filename" title="'+entry.file_name+'">';
		html += 				entry.file_name;
		html += '						</div>';
		html += '						<div class="viewer-filename">'+sizeInFormat+'</div>';
		html += '					</div>';
		});
		html += '				</div>';
		html += ' 			</td>';
		html +=	'		</tr>';
		html += '	</table>';
		}		
		html +=	'	<table cellpadding="10" cellspacing="0" width="100%" style="font-size: 12px;margin-top:20px;float:left">'
		/* subject */
		
		var subject = (values.bd_subject == '')? firstFileName : values.bd_subject;
		
		html +=	'		<tr>';
		html +=	     		'<th '+subjectAttr+' style="font-size:16px;height:33px;padding:10px 0 0 0;border-top:1px solid black">' + subject + '</th>';
		html +=	'		</tr>';
		html +=	'		<tr>';
		html +=	     		'<td style="border-bottom:1px solid black;height:13px;font-size:12px;padding:0 0 10px 0">';
		html += '				<span style="font-weight: 600">' + loc.main.user+'</span>:'+values.bd_name+', ';
		html += '				<span style="font-weight: 600">' + loc.main.regDate+'</span>:'+values.bd_regdate+', ';
		html += '				<span style="font-weight: 600">Data ID</span>:'+values.bd_idx+'</td>';
		html +=	'		</tr>';
		html += '	</table>';
		/* custom fields */
		if(values.bd_data.length > 0){
		html +=	'	<div style="width:100%" class="section-space;float:left">';
		html +=	'		<table  width="100%"  style="font-size: 12px">';
			Ext.Array.each(values.bd_data, function(entry, index){
				var fldOpt = getOption((viewer.colsList[index].cols_option));
                if(entry.cols_type == 'number' && fldOpt.numberFormat != undefined){
                    if(entry.data_val.indexOf(',') == -1) entry.data_val = Ext.util.Format.number(entry.data_val, fldOpt.numberFormat);
                }
				if(fldOpt.render == 'image') entry.cols_code = 'image';
				var hidden = ctlr.getHideField(fldOpt)? true : false;
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
				if(entry.cols_type == 'check'){
					cUnit = '(' + cUnit + ')';
				}
				var customAttr = ' class="custom-field" fieldIndex="'+index+'" rennder="'+fldOpt.render+'" cols_code="'+entry.cols_code+'" bd_idx="'+values.bd_idx+'" unit="'+cUnit+'" dataVal="'+entry.data_val+'" cols_idx="'+entry.cols_idx+'" cols_name="'+entry.cols_name+'" cols_type="'+entry.cols_type + '"';
				if(ctlr.getDisableField(fldOpt)) customAttr = '';
				if(entry.cols_type == 'dataset' && !hidden){
		html +=	'			<tr>';
		html += '				<th  valign="top" style="text-align: left">'+entry.cols_name+'</th><td>';
        html += getController('Viewer').getDatasetTable(viewer.colsList[index], customAttr);
		html += '				</td>';
		html += '			</tr>';
				}
				/* link field */
				else if(entry.cols_type == 'link'  && !hidden){
		html += '			<tr>';
		html +=	'				<th  valign="top" style="text-align: left">'+entry.cols_name+'</th>';
		html += '				<td height=23 '+customAttr+'>';
					if(entry.data_val.length > 0){
		html +=	'					<div style="width:100%">';
						var ids = entry.data_val.split(',');
						Ext.Array.each(ids, function(item){
							var url = domain + '/thumb/' + item.trim() + '/0/T';
							var parameters = item.trim() + ',' + item.cols_name;
							var clickEvt = 'getController(\'Viewer\').showLinkInformation('+parameters+')';
		html +=	'						<div class="viewer-link" onclick="'+clickEvt+'" cols_name="'+item.cols_name+'" bd_idx="'+item.trim()+'"';
		html += '						style="background:URL('+url+');background-repeat:no-repeat;background-position:center">';
		html += '						</div>';
						});
		html += '					</div>';
					}
		html += '				</td>';
		html +=	'			</tr>';
				}
				/* end link field */
				/* color radio field */
				else if(entry.cols_type == 'colorchk' && !hidden){
		html +=	'			<tr>';
		html += '				<th style="text-align: left">'+entry.cols_name+'</th>';
		html += '				<td  '+customAttr+'>';
					if(entry.data_val.length > 0){
		html += 					ctlr.getColorradio(entry.data_val);
					}
		html += '				</td>';
		html += '			</tr>';
				}
				else if(entry.cols_type == 'url' && !hidden){
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
				else if(entry.cols_type == 'color' && !hidden){
		html += '			<tr>';
		html +=	'				<th style="text-align: left">'+entry.cols_name+'</th>';
		html += '				<td  '+customAttr+'><div  style="width:15px;height:15px;background-color:'+entry.data_val+'"></div></td>';
		html +=	'			</tr>';
				}
				else if(entry.cols_type == 'color256' && !hidden){
		html +=	'			<tr>';
		html +=	'				<th style="text-align: left">'+entry.cols_name+'</th>';
		html += '				<td  '+customAttr+'>';
					Ext.Array.each(entry.data_val.split(','), function(item){
		html += '					<div class="color256" style="float:left;width:15px;height:15px;background-color:'+item.trim()+'"></div>';
					});
		html += '				</td>';
		html +=	'			</tr>';
				}
				else if(entry.cols_type == 'datagrp' && !hidden){
		html +=	'			<tr>';
		html +=	'				<th style="text-align: left">'+entry.cols_name+'</th>';
		html += '				<td  '+customAttr+' value="'+entry.data_val+'" relatedCategory="'+entry.cols_category+'">';
					if(entry.data_val ==='' || entry.data_val === undefined || entry.data_val === null){

					}
					else{
		html += '					<div style="float:left">'+entry.data_val+'</div>';
		html += '					<i class="fa fa-external-link" aria-hidden="true" value="'+entry.data_val+'" onclick="getController(\'Viewer\').showDataGroupInfomation(this)" relatedCategory="'+entry.cols_category+'" style="float:left;margin:2px 0 0 7px;cursor:pointer"></i>';
					}
		html += '				</td>';
		html +=	'			</tr>';
				}
				else{
					if(entry.cols_code == 'image' && !hidden){
                        var imageSize = (entry.data_val === '')? '' : 'width:85px;height:85px;';
		html +=	'		<tr>';
		html += '			<th style="width:180px;text-align: left">' + entry.cols_name + '</th>';
		html += '			<td  ' + customAttr + ' imgSrc="'+entry.data_val+'">';
                        if(entry.data_val != '') {
                            html += '				<img style="max-height: 85px;cursor: pointer" src="' + entry.data_val + '" onerror="this.src =\'resources/images/ico_broken.png\'" onclick="getController(\'Viewer\').viewImage(this)">'
                        }
		html += '			</td>';
		html += '		</tr>';
					}
					else if(entry.cols_code == 'linked' && !hidden){
						var arr = entry.data_val.split('，');
						var cNames = [];
						for(i=0; i<arr.length; i++){
							cNames.push(arr[i].split('＠')[0]);
						}
		html +=	'		<tr>';
		html += '			<th style="width:180px;text-align: left">' + entry.cols_name + '</th>';
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
                    else if(entry.cols_code == 'getColors'){
                        var colors = getController('Config').getColorChips(eval(entry.data_val));
        html +='        <tr>';
        html +='			<th style="width:180px">' + entry.cols_name + '</th>';
        html +='        	<td>' + colors;
        html +='        	</td>';
        html +='        </tr>';
                    }
					else if(entry.cols_code == 'checkedby') {

					}
					else{
						if(!hidden) {
                            if (entry.data_val == '') cUnit = '';
        html += '		<tr>';
        html += '			<th style="width:180px;text-align: left">' + entry.cols_name + '</th>';
        html += '			<td  ' + customAttr + '>' + entry.data_val + cUnit + '</td>';
        html += '		</tr>';
                        }
					}
				}
			});
			var remark = values.bd_content;
			if(remark === undefined) remark = '';
			
		html +=	'			<tr>';
		html +=	'				<th valign="top" style="text-align: left">'+loc.main.description+'</th><td height=25 '+contentAttr+'>'+remark+'</td>';
		html +=	' 			</tr>';
		html +=	'			<tr>';
		html +=	'				<td '+subjectAttr+' colspan=2 style="font-size:16px;height:1px;border-bottom:1px solid"></th>';
		html +=	'			</tr>';
		html +=	'		</table>';
		
		/* attachment for clone category */
		if(values.originalFiles !== undefined){
			if(values.originalFiles.length > 0){
		html += '		<table border="0" cellpadding="0" cellspacing="0" style="float:left;border-collapse: collapse;width:100%;margin-top:10px;border-top:1px solid black;border-bottom:1px solid black">';
		html += '			<tr>';
		html += '				<td style="background-color: white;font-size: 12px;padding:8px;border-bottom:1px solid black">';
		html += values.originalCategoryName +' '+loc.main.attachFile;
		html += '				</td>';
		html += '			</tr>';
		html += '			<tr>';
		html += '				<td style="background-color: white;padding:8px">';
		html += '					<div style="width:100%">';
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
		html += '						<div class="viewer-attach-unit"  style="background-color: white;width:'+brdWidth+';float: left;margin: 0 5px 5px 0; cursor: pointer">';
		html += '							<div style="background-image:url('+tPath+');background-size:'+backSize+'" '+attr+' class="viewer-download-image  viewer-attach-image"></div>';
		html += '							<div class="viewer-filename" title="'+entry.file_name+'">';
		html += 							entry.file_name;
		html += '							</div>';
		html += '							<div class="viewer-filename">'+sizeInFormat+'</div>';
		html += '						</div>';
			});
		html += '					</div>';
		html += '				</td>';
		html +=	'			</tr>';
		html += '		</table>';
			}				
		}		
		html += '	</div>';
		}
		html +=	'	<div class="viewer-header" style="padding-top:25px;float:left ">';
		if(values.companyInfo !== undefined){
		html += '		<img src="'+values.companyInfo.company_logo+'" class="viewer-logo">';
		html += '		<div style="float:left;height:100%;margin-left:10px">';
		html += '			<div class="viewer-companyname">'+ values.companyInfo.company_name +'</div>';
		html += '			<div class="viewer-addr">'+ values.companyInfo.company_addr1 + ' ' + values.companyInfo.company_addr2 +'</div>';
		html += '		</div>';
		}
		html += '	</div>';
		html += '</div>';
		viewer.setHtml(html);
		viewer.setHidden(false);
		viewer.fireEvent('formcomplete', viewer);
	}	
});