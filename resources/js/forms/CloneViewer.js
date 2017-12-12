Ext.define('resources.js.forms.CloneViewer', {
	singleton : true,
	CLASSNAME:'CloneViewer',
	getName:function(){
		return loc.viewer.CloneViewer;
	},
	isNeedDataGroup:false,//data group을 미리 불러와 사용할지 여부 설정
	isForAnyCategory:false,//모든 카테고리에서 자동으로 사용 가능 여부 설정
	fileName:'information.jpg',
	setHtml:function(values, viewer){
		var ctlr = getController('Viewer');
		var subjectAttr = ' class="basic-field" field_type="subject" bd_idx="'+values.bd_idx+'"';
		var html;
		var i,j;
        var maxWidth = 420 * values.length + 'px';
        var minWidth = 350 * values.length + 'px';
        var changedColor = '#960400';
		html  = '<div style="padding:1px;font-size: 12px;color:#555555;margin:0 auto;max-width:'+maxWidth+';min-width:'+maxWidth+';height:100%">';
		/* header */
		html += '	<table border="1" style="float:left;font-size:12px;border-collapse: collapse;table-layout: fixed;word-break: break-all;border:1px solid #dee0e2" class="clone-table">';
        html += '		<tr>';
        for(i=0; i<values.length; i++){
            var backColor = (i===0)? '#2a2c2f' : '#5a5c5f';
        html += '			<td colspan="2" style="height:35px;font-weight:600;font-size:16px;line-height:200%;color:white;background-color:'+backColor+'">'+values[i].ca_name+'</td>';    
        }
        html += '		</tr>';
		html += '		<tr>';
        for(i=0; i<values.length; i++){
            var subject = values[i].bd_subject;
            var subjectTitle = values[0].subjectTitle;
            if(subject.trim() === ''){
                subject = values[0].bd_subject;
            }
            if(values[0].bd_subject != subject){
                subjectTitle = '<span style="color:'+changedColor+';font-weight:400">' +subjectTitle+'<span>';
            }
            if(subject === undefined) subject = '';
		html += '			<th style="width:150px" class="value">'+subjectTitle+'</th><td style="min-width:180px"><div class="value">'+subject+'</div></td>';
        }
		html += '		</tr>';
		html += '		<tr>';
        for(i=0; i<values.length; i++){
            var nameLabel, bdName;
            if(values[0].bd_last_modify_id != values[i].bd_last_modify_id){//in case not same with original data
                nameLabel = 	'<span style="color:'+changedColor+';font-weight:400">' +loc.main.lastModifyBy+'</span>';
                bdName = '<a href="#" uId="'+values[i].bd_last_modify_id+'" onclick="getController(\'Main\').showUserInfo(this)" style="cursor:pointer">' + values[i].bd_last_modify_id + '</a>';
            }
            else{
                nameLabel = loc.main.user;
                bdName = '<a href="#" uId="'+values[0].bd_last_modify_id+'" onclick="getController(\'Main\').showUserInfo(this)" style="cursor:pointer">' + values[0].bd_name + '</a>';
            }
		html += '			<th>'+nameLabel+'</th><td>'+bdName+'</td>';
        }
		html += '		</tr>';
		html += '		<tr>';
        for(i=0; i<values.length; i++){
            var regDate;
            if(values[0].bd_regdate != values[i].bd_regdate){//in case not same with original data
                regDate = 	'<span style="color:'+changedColor+';font-weight:400">' +loc.main.editDay+'<span>';
            }
            else{
                regDate = loc.main.regDate;
            }
		html += '		<th>'+regDate+'</th><td>'+values[i].bd_regdate+'</td>';
        }
		html += '		</tr>';
		html += '		<tr>';
        for(i=0; i<values.length; i++){
            var dataId;
            if(values[0].bd_idx != values[i].bd_idx){//in case not same with original data
                dataId = 	'<span style="color:'+changedColor+';font-weight:400">Data ID<span>';
            }
            else{
                dataId = 'Data ID';
            }            
		html += '			<th>'+dataId+'</th><td>'+values[i].bd_idx+'</td>';
        }
		html += '		</tr>';
		html += '		<tr>';
        for(i=0; i<values.length; i++){
            var bdContent;
            if(values[0].bd_content != values[i].bd_content){//in case not same with original data
                bdContent = 	'<span style="color:'+changedColor+';font-weight:400">' +loc.main.description.replace(':', '')+'<span>';
            }
            else{
                bdContent = loc.main.description.replace(':', '');
            }            
		html += '			<th>'+bdContent+'</th><td>'+values[i].bd_content+'</td>';
        }
		html += '		</tr>';
		if(values[0].bd_data.length > 0) {
			Ext.Array.each(values[0].bd_data, function(entry, index){
                var entries = [entry];
                var fldOpt = getOption(viewer.colsList[index].cols_option);
                var customAttr = ' class="custom-field" fieldIndex="'+index+'" render="'+fldOpt.render+'" unit="'+cUnit+'" cols_name="'+entry.cols_name+'" cols_type="'+entry.cols_type + '"';
                var ca0 = customAttr + ' bd_idx="'+values[0].bd_idx + '" dataVal="'+entry.data_val+'" cols_code="'+entry.cols_code+'" cols_idx="'+entry.cols_idx+'"';
                var customAttrs = [ca0];
                for(j=1; j<values.length; j++){
                    var col = values[j].bd_data[index];                    
                    if(col.data_val.trim() === ''){
                        col.data_val = entry.data_val;
                    }
                    if(entries[0].data_val != col.data_val){
                        col.cols_name = '<span style="color:'+changedColor+';font-weight:400">'+col.cols_name+'</span>';
                    }                    
                    entries.push(col);
                    customAttrs.push(customAttr+' bd_idx="'+values[j].bd_idx+'" dataVal="'+col.data_val+'" cols_code="'+col.cols_code+'" cols_idx="'+col.cols_idx+'"');
                }

				var fldOpt = getOption(viewer.colsList[index].cols_option);
                if(fldOpt.render == 'image') entry.cols_code = 'image';
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
				if(entry.cols_type == 'number' && fldOpt.numberFormat !== undefined){
                    for(i=0; i<entries.length; i++){
                    if(entries[i].data_val.indexOf(',') == -1) entries[i].data_val = Ext.util.Format.number(entries[i].data_val, fldOpt.numberFormat);
                    }
				}
				if(entry.cols_type == 'dataset'){
		html += '		<tr>';
                    for(i=0; i<entries.length; i++){
		html += '			<th>'+entry.cols_name+'</th>';
		html += '			<td>';
		html += getController('Viewer').getDatasetTable(viewer.colsList[index], customAttrs[i], 'datasetView');
		html += '			</td>';
                    }
		html += '		</tr>';
				}
				else if(entry.cols_type == 'link'){
		html += '		<tr>';
                    for(i=0; i<entries.length; i++){
                        if(entries[i].data_val.length === 0){
                            entries[i].data_val = entries[0].data_val;
                        }
		html += '			<th>'+entries[i].cols_name+'</th>';
		html +=	'			<td>';
                        if(entries[i].data_val.length > 0){
		html += '				<div style="width:100%">';
						var ids = entries[i].data_val.split(',');
						Ext.Array.each(ids, function(item){
							var url = domain + '/thumb/' + item.trim() + '/0/T';
							var parameters = item.trim() + ',' + item.cols_name;
							var clickEvt = 'getController(\'Viewer\').showLinkInformation('+parameters+')';
		html +=	'					<div class="viewer-link-noline" onclick="'+clickEvt+'" cols_name="'+item.cols_name+'" bd_idx="'+item.trim()+'"';
		html += '					style="float:left;width:100px;height:100px;margin-right:5px;background:URL('+url+');background-repeat:no-repeat;background-position:center">';
		html += '					</div>';
			});
		html += '				</div>';
		html += '			</td>';
                        }
		}
		html += '		</tr>';
				}
				else if(entry.cols_type == 'colorchk'){
		html +=	'		<tr>';
                    for(i=0; i<entries.length; i++){
		html +=	'			<th>'+entries[i].cols_name+'</th>';
		html += '			<td  '+customAttrs[i]+'>';
                        if(entries[i].data_val.length > 0){
		html += 				ctlr.getColorradio(entries[i].data_val);
                        }
		html += '			</td>';
                    }
		html +=	'		</tr>';
				}
				else if(entry.cols_type == 'url'){
					html +=	'		<tr>';
                    for(i=0; i<entries.length; i++){
					html +=	'			<th>'+entries[i].cols_name+'</th>';
					html += '			<td  '+customAttrs[i]+'>';
                        var urlLink;
                        if(entries[i].data_val.indexOf('http://') == -1){
                            urlLink = 'http://' + entries[i].data_val;
                        }
                        else{
                            urlLink = entries[i].data_val;
                        }
					html += 			'<a href="#" onclick="window.open(\''+urlLink+'\',\''+entry.cols_name+'\')">' + loc.viewer.open + '</a>';
					html += '			</td>';
                    }
					html +=	'		</tr>';
				}
				else if(entry.cols_type == 'color'){
		html +=	'		<tr>';
                    for(i=0; i<entries.length; i++){
		html +=	'			<th>'+entries[i].cols_name+'</th>';
		html += '			<td  '+customAttrs[i]+'><div  style="width:13px;height:13px;background-color:'+entries[i].data_val+'"></div></td>';
                    }
		html +=	'		</tr>';
				}
				else if(entry.cols_type == 'color256'){
		html +=	'		<tr>';
                    for(i=0; i<entries.length; i++){
		html +=	'			<th>'+entries[i].cols_name+'</th>';
		html += '			<td  '+customAttrs[i]+'>';
					Ext.Array.each(entries[i].data_val.split(','), function(item){
		html += '				<div class="color256" style="float:left;width:13px;height:13px;background-color:'+item.trim()+'"></div>';
					});
		html += '			</td>';
                    }
		html +=	'		</tr>';
				}
				else if(entry.cols_type == 'datagrp'){
		html +=	'		<tr>';
                    for(i=0; i<entries.length; i++){
		html +=	'			<th>'+entries[i].cols_name+'</th>';
		html += '			<td  '+customAttrs[i]+' value="'+entries[i].data_val+'" relatedCategory="'+entries.cols_category+'">';
					if(entries[i].data_val ==='' || entries[i].data_val === undefined || entries[i].data_val === null){

					}
					else{
		html += '				<div style="float:left;height:13px">'+entries[i].data_val+'</div>';
		html += '				<i class="fa fa-external-link" aria-hidden="true" value="'+entries[i].data_val+'" onclick="getController(\'Viewer\').showDataGroupInfomation(this)" relatedCategory="'+entry.cols_category+'" style="float:left;margin:2px 0 0 7px;cursor:pointer"></i>';
					}
		html +=	'			</td>';
                    }
		html += '		</tr>';
				}
				else{
					var isGetRecord = (fldOpt.getRecord !== undefined || fldOpt.getValue !== undefined)? true : false;
					if(entry.cols_code == 'image' && !isGetRecord){
		html +=	'		<tr>';
                        for(i=0; i<entries.length; i++){
		html += '			<th>' + entries[i].cols_name + '</th>';
		html += '			<td  ' + customAttrs[i] + ' imgSrc="'+entries[i].data_val+'">';
                            if(entries[i].data_val !== '') {
        html += '				<img style="max-height: 85px;cursor: pointer" src="' + entries[i].data_val + '" onerror="this.src =\'resources/images/ico_broken.png\'" onclick="getController(\'Viewer\').viewImage(this)">';
                            }
		html += '			</td>';
                        }
		html += '		</tr>';
					}
					else if(isGetRecord){
                        var recVal = decodeURIComponent(values[0]);
                        if(recVal.indexOf('file_name=') != -1 && recVal.indexOf('bd_subject=') != -1 && recVal.indexOf('bd_idx=') != -1) {
        html +=	'		<tr>';
                            for(i=0; i<entries.length; i++){
        html += '			<th>' + entries[i].cols_name + '</th>';
        html += '			<td >';
         html +=                 	getController('Viewer').showCopiedFile(recVal, fldOpt);
        html += '			</td>';
                            }
        html += '		</tr>';
                        }
                        else{
        html +=	'		<tr>';
                            for(i=0; i<entries.length; i++){
        html += '			<th>' + entries[i].cols_name + '</th>';
        html += '			<td  ' + customAttrs[i] + '>' + entries[i].data_val + cUnit + '</td>';
                            }
        html += '		</tr>';
						}
					}
                    else if(entry.cols_code == 'linked'){
                        for(i=0; i<entries.length; i++){
                            var arr = entries[i].data_val.split('，');
                            var cNames = [];
                            for(j=0; i<arr.length; j++){
                                cNames.push(arr[j].split('＠')[0]);
						}
		html +=	'		<tr>';
		html += '			<th>' + entries[i].cols_name + '</th>';
		html += '			<td  ' + customAttrs[i] + '>' + cNames.join() + '</td>';
		html += '		</tr>';
                        }
					}
                    else if(entry.cols_code == 'percent' || fldOpt.render == 'percent'){
        html +='		<tr>';
                        for(i=0; i<entries.length; i++){
        html +='			<th>' + entries[i].cols_name + '</th>';
        html +='			<td ' + customAttrs[i] + '>';
        html +=					entries[i].data_val+cUnit;
        html +='			</td>';
                        }
        html +='		</tr>';
                    }
                    else if(entry.cols_code == 'colorHex' || fldOpt.render == 'colorHex'){
                    	if(entry.data_val.charAt(0) != '#'){
                    		entry.data_val = '#' + entry.data_val;
						}
        html +='		<tr>';
                        for(i=0; i<entries.length; i++){
        html +='			<th>' + entries[i].cols_name + '</th>';
        if(viewer.hasRGB){//수정 금지
            customAttrs[i] = ' fieldIndex="'+index+'" render="'+fldOpt.render+'"  bd_idx="'+values.bd_idx+'" unit="'+cUnit+'" dataVal="'+entry.data_val+'" cols_code="'+entry.cols_code+'" cols_idx="'+entry.cols_idx+'" cols_name="'+entry.cols_name+'" cols_type="'+entry.cols_type + '"';
        html += '			<td ' + customAttrs[i] + '>';
        }
        else{//수정가능
        html += '			<td ' + customAttrs[i] + '>';
		}
        html +='				<div style="float: left;width: 30px;height:20px;border:1px solid #cccccc: ;background-color: '+entry.data_val+';"></div>';
        html +='				<span style="float: left;margin-left: 8px">' + entries[i].data_val + '</span>';
        html +='			</td>';
                        }
        html +='		</tr>';
                    }
                    else if(entry.cols_code == 'getColors'){
        html +='        <tr>';
                        for(i=0; i<entries.length; i++){
                            var colors = getController('Config').getColorChips(eval(entries[i].data_val));
        html +='			<th>' + entries[i].cols_name + '</th>';
        html +='        	<td>' + colors;
        html +='        	</td>';
                        }
        html +='        </tr>';
					}
					else{
						if(entry.data_val === '' || entry.cols_type == 'idx') cUnit = '';
		html +=	'		<tr>';
                        for(i=0; i<entries.length; i++){
		html += '			<th>' + entries[i].cols_name + '</th>';
		html += '			<td  ' + customAttrs[i] + '>' + entries[i].data_val + cUnit + '</td>';
                        }
		html += '		</tr>';
					}
				}
			});
		}
        html +=	'		<tr>';
        for(i=0; i<values.length; i++){
        html +='        	<td colspan="2"><strong>' +loc.main.attachFile+ '</strong>' ;
        html +='        	</td>';            
        }
        html += '		</tr>';
        html +=	'		<tr>';
        /* attachment */
        for(i=0; i<values.length; i++){
        html +='        	<td colspan="2" style="padding:10px">';
            var bdFile = values[i].bd_file;
            for(j=0; j<bdFile.length; j++){
				var tPath = bdFile[j].thumb_path;
				if(!Ext.isIE) tPath += '?c=' + randomString(16);
				var oPath = tPath.replace('thumb', 'file');//origial image(jpg) size path
				var dPath = 'binder/down/' + bdFile[j].bd_idx + '/' + j;//original file download path
				var pixels = bdFile[j].file_height * bdFile[j].file_width;
				var sizeInFormat = ctlr.autoFilesizeFormat(bdFile[j].file_size);
				var resol = bdFile[j].file_width+'x'+bdFile[j].file_height;
				var backSize = 'contain';
				var isImage = getController('Config').isImage(bdFile[j]);
				if(!isImage) backSize = 'auto';
				var brdWidth = '120px', brdHeight = '120px';  
				if(bdFile[j].file_width === 0) {
                    backSize = 'inherit';
                }
				var attr = 'thumbSrc="'+tPath+'" viewSrc="'+oPath+'" downSrc="';                
				attr += dPath+'" pixels="'+pixels+'" filesize="'+bdFile[j].file_size+'" resolution="'+resol+'" filename="'+bdFile[j].file_name+'"';
		html += '							<div class="viewer-attach-unit"  style="background-color: white;width:'+brdWidth+';float: left;margin: 0 5px 5px 0; cursor: pointer">';
		html += '								<div style="background-image:url('+tPath+');background-size:'+backSize+'" '+attr+' class="viewer-download-image  viewer-attach-image"></div>';
		html += '								<div class="viewer-filename" title="'+bdFile[j].file_name+'">';
		html += 							bdFile[j].file_name;
		html += '								</div>';
		html += '								<div class="viewer-filename">'+sizeInFormat+'</div>';
		html += '							</div>';
            }
        html +='        	</td>';            
        }
        html += '		</tr>';        
		html += '	</table>';

		html += '</div>';
		viewer.setHtml(html);
		viewer.setHidden(false);
		viewer.fireEvent('formcomplete', viewer);
	}
});