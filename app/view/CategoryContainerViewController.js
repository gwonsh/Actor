/*
 * File: app/view/CategoryContainerViewController.js
 *
 * This file was generated by Sencha Architect version 4.2.2.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 6.5.x Classic library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 6.5.x Classic. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('Actor.view.CategoryContainerViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.categorycontainer',

    id: 'categoryItems',

    setCategories: function() {
        var configCtrl = getController('Config');
        var wkTargets = [];
        var tkTargets = [];
        //designate accodian panel in westpanel
        var me = this;
        var cateCon = this.getView();
        var treeStore = Ext.getStore('CategoryStore');
        treeStore.on('load', function onTreestoreLoad(){
            treeStore.un('load', onTreestoreLoad);
            //finding task, sales adn workgroup
            var rawData = treeStore.getProxy().getReader().rawData;
            Ext.Array.each(rawData, function(entry, index){//with categories at root
                if(entry.isBoard){//detecting board
                    entry.index = index;
                    cateCon.getViewModel().getData().notices.push(entry);
                }
                var options = getOption(entry.option);
                /* check if work category exsits */
                if(options.categoryCode){
                    var pluginName = options.categoryCode;
                    var pluginTitle = entry.title;
                    if(pluginName == 'taskGroup'){
                        tkTargets.push({
                            rootId:entry.id,
                            rootOpt:options,
                            pluginName:options.categoryCode,
                            pluginTitle:entry.title
                        });
                    }
                    if(pluginName == 'workGroup' || pluginName == 'salesGroup'){
                        wkTargets.push({
                            rootId:entry.id,
                            rootOpt:options,
                            pluginName:options.categoryCode,
                            pluginTitle:entry.title
                        });
                    }
                }

            });
            //configure task, sales and workgroups by found
            if(tkTargets.length > 0 || wkTargets.length > 0){
                me.setGroups(tkTargets, wkTargets);
            }
        });
        treeStore.load();

        var tree = Ext.create('Ext.tree.Panel', {
            id: 'categoryTree',
            itemId: 'categoryTree',
            width: 220,
            collapsible:false,
            animate: false,
            selectedTitle:'',
            selectedOption:{},
            flex:1,
            hideCollapseTool:true,
            title:{
                layout:'hbox',
                text:'<i class="fa fa-sitemap" aria-hidden="true" style="margin-right:5px"></i>' + loc.main.category,
                items:[
                    {
                        xypte:'button',
                    }
                ]
            },
            tools:[{//category setting icon
                iconCls:'fa fa-cog',
                tooltip:loc.main.config,
                hidden:true,
                handler: function(event, toolEl, panel){
                    configCtrl.settingCategory();
                },
                listeners:{
                    beforerender:function(tool){
                        if(userInfo.nv_level >= 5){
                            tool.show();
                        }
                    }
                }
            }],
            collapsed:true,
            store: treeStore,
            hideHeaders:true,
            rootVisible:false,
            useArrows: true,
            viewConfig: {
                itemId: 'mytreeview'
            },
            columns: [
                {
                    xtype: 'treecolumn',
                    flex:1,
                    iconCls:'treeicon-disabled',
                    dataIndex:'title',
                    renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                        var caOpt = getOption(record.get('option'));
                        var cIcon = caOpt.icon;
                        if(!cIcon) cIcon = 'folder-o';
                        var css = 'style="float:right;cursor:pointer;opacity:0.2;width:8px;height:100%;text-align:center"';
                        var val = '';
                        val    += 	'<i class="fa fa-'+cIcon+'" aria-hidden="true"></i>' + ' ' + value;
                        val    += 	'<div class="fa fa-ellipsis-v" '+css+' aria-hidden="true" title="'+loc.config.setShortcut+'"></div>';
                        return val;
                    }
                }
            ],
            listeners: {
                itemclick: function (dataview, record, item, index, e, eOpts){
                    var options = getOption(record.get('option'));
                    if(options.error !== undefined){
                        Ext.toast(loc.error.optionError + '/Category:' + record.get('title'));
                    }
                    var cId = record.get('id');
                    if(currentPlugin !== ''){
                        getController('Main').getListTab().removeAll();
                    }
                    if(currentPlugin == 'taskGroup'){
                        var southPan = getController('Main').getMainView().down('#southPanel');
                        southPan.removeAll();
                        southPan.setHidden(true);
                    }
                    if(currentPlugin == 'salesGroup' || currentPlugin == 'workGroup'){
                        var workListPan =  Ext.getCmp('centerPanel').down('#workListPanel');
                        workListPan.destroy();
                    }
                    currentPlugin = '';
                    var mainCtr = getController('Main');
                    var splash = Ext.getCmp('contentCover');

                    tree.selectedTitle = record.get('title');
                    tree.selectedOption = options;
                    tree.selectedId = record.get('id');

                    if(splash) splash.destroy();
                    //when click the config icon at node
                    if(Ext.get(e.target).dom.className == 'fa fa-ellipsis-v'){
                        var tmpStr = JSON.stringify(shortcuts);
                        //check if it already has been added
                        var isExist = false;
                        if(tmpStr.indexOf('"caId":' + '"'+record.get('id')+'"') != -1){
                            isExist = true;
                        }
                        //show deleting or adding shortcut menu
                        var menu = Ext.create('Ext.container.Container', {
                            header:false,
                            x:e.pageX - 5,
                            y:e.pageY - 5,
                            floating:true,
                            renderTo:Ext.getBody(),
                            layout:'vbox',
                            items:[
                                {
                                    xtype:'button',
                                    text:(isExist)? loc.config.delShortcut : loc.config.addShortcut,
                                    iconCls:(isExist)? 'fa fa-trash-o' : 'fa fa-bookmark-o',
                                    style:(isExist)? 'background-color:#c13518;border-color:#c13518' : '',
                                    handler:function(){
                                        var scStr = JSON.stringify(shortcuts);
                                        var action = (isExist)? 'del' : 'add';
                                        configCtrl.addDelShortcut(record, action);
                                        menu.destroy();
                                    }
                                }
                            ],
                            listeners:{
                                render:function(comp){
                                    comp.el.on('mouseleave', function(){
                                        menu.destroy();
                                    });
                                }
                            }
                        });
                        return;
                    }
                    var gridType = getController('Config').getLayout(record.get('data').layout);
                    if(!isHtml5()){
                        gridType = 'normal';
                    }
                    //in case the browser is IE and version is less than 10
                    if(detectIE() && detectIE() < 10) gridType = 'normal';

                    /* check if it is a schedule category */
                    if(options.schedule){
                        gridType = 'schedule';
                    }
                    if(options.colorChip){
                        gridType = 'colorChip';
                    }
                    var grid = mainCtr.getGrid(cId, gridType, record.get('title'));
                    mainCtr.setGrid(grid);

                    //set default the displayed num of item in grid
                    var rows = record.get('rows');
                    if(rows === undefined || rows === '') rows = basicSetting.numOfItem;
                    grid.numOfItem = rows;
                    if(record.get('ca_subject_title') !== '' && record.get('ca_subject_title') != eval(null)){
                        grid.subjectTitle = record.get('ca_subject_title');
                    }
                    else{
                        grid.subjectTitle = loc.main.title;
                    }
                }
            }
        });
        cateCon.insert(2, tree);
    },

    setGroups: function(tks, wgs) {
        var me = this;
        var cateCon = this.getView();
        cateCon.taskCount = 0;
        cateCon.workCount = 0;
        var setWorkGroup = function(){
            if(wgs.length > 0){
                cateCon.on('workgroupcomplete', function(subCaFieldSet){
                    cateCon.workCount += 1;
                    if(cateCon.workCount < wgs.length){
                        me.getWorkCategories(wgs[cateCon.workCount], cateCon.workCount);
                    }
                });
                me.getWorkCategories(wgs[cateCon.workCount], cateCon.workCount);
            }
        };
        cateCon.on('taskgroupcomplete', function(subCaFieldSet, subCategories){//collect task group information
            cateCon.taskCount += 1;
            if(cateCon.taskCount < tks.length){
                me.getTaskCategories(tks[cateCon.taskCount]);
            }
            if(cateCon.taskCount == tks.length){ // find work and salesgroup information after finish collecting of taskgroup
                setWorkGroup();
            }
        });
        if(tks.length > 0){
            this.getTaskCategories(tks[cateCon.taskCount]);
        }
        else{
            //setup workgroup only when no taskgroup exist
            setWorkGroup();
        }

    },

    getTaskCategories: function(taskgroup) {
        var me = this;
        var cId = taskgroup.rootId;
        Ext.data.JsonP.request({
            url:getCategoryListApi(cId),
            success:function(response){
                var caOpt;
                var cas = [];//the second categories except for setting
                var subCaFieldSet = [];
                var hasTask = false;
                var hasSetting = false;
                for(i=0; i<response.length; i++){
                    caOpt = getOption(response[i].data.ca_option);
                    if(caOpt.categoryCode == 'task') {
                        cas.push(response[i]);
                        tasks = true;
                    }
                    if(caOpt.categoryCode == 'setting'){
                        settings = true;
                        /* it will become title of southpanel */
                        var headerTitle = caOpt.title;
                        if(!headerTitle){
                            headerTitle = '';
                        }
                        /* check if alter category name exists */
                        if( caOpt !== null || opt !== '' || opt !== undefined){
                            var categoryName = caOpt.categoryName;
                            if(categoryName){
                                response[i].newTitle = categoryName;
                            }
                        }
                        /* to copy category options from setting when new category is created */
                        subCaFieldSet.push({
                            ca_cpmv:response[i].data.cpmv,
                            ca_delete:response[i].data.del,
                            ca_download:response[i].data.download,
                            ca_history:response[i].data.ca_history,
                            setCateId:response[i].data.id,
                            ca_info_view:response[i].data.ca_info_view,
                            ca_layout:response[i].data.layout,
                            ca_name:response[i].title,
                            ca_newName:response[i].newTitle,
                            ca_option:response[i].data.ca_option,
                            ca_order:response[i].data.order,
                            ca_page_row:response[i].data.page_row,
                            ca_type:response[i].data.type,
                            ca_use_email:response[i].data.ca_use_email,
                            ca_use_email_to:response[i].data.ca_use_email_to,
                            ca_view:response[i].data.view,
                            ca_write:response[i].data.write,
                            headerTitle:headerTitle,
                            is_approval:response[i].data.isApproval,
                            is_board:response[i].data.isBoard,
                            permission:response[i].data.permission
                        });
                    }
                }
                me.getView().fireEvent('taskgroupcomplete', subCaFieldSet, cas);
                me.initializeGroup(cas, subCaFieldSet, taskgroup.pluginTitle, taskgroup.pluginName);
            }
        });
    },

    getWorkCategories: function(workgroup, index) {
        var me = this;
        var cId = workgroup.rootId;
        var getWGroupSetting = function(sId, idx, cas){
            Ext.data.JsonP.request({
                url:getCategoryListApi(sId),
                success:function(result){
                    var subCaFieldSet = [];
                    Ext.Array.each(result, function(entry, idx){
                        /* change category name if new name given */
                        var opt = entry.data.ca_option;
                        if( opt !== null || opt !== '' || opt !== undefined){
                            var categoryName = getOption(opt).categoryName;
                            if(categoryName){
                                entry.newTitle = categoryName;
                            }
                        }
                        subCaFieldSet.push({
                            ca_cpmv:entry.data.cpmv,
                            ca_delete:entry.data.del,
                            ca_download:entry.data.download,
                            ca_history:entry.data.ca_history,
                            ca_id:entry.data.id,
                            ca_info_view:entry.data.ca_info_view,
                            ca_layout:entry.data.layout,
                            ca_name:entry.title,
                            ca_newName:entry.newTitle,
                            ca_option:entry.data.ca_option,
                            ca_order:entry.data.order,
                            ca_page_row:entry.data.page_row,
                            ca_type:entry.data.type,
                            ca_use_email:entry.data.ca_use_email,
                            ca_use_email_to:entry.data.ca_use_email_to,
                            ca_view:entry.data.view,
                            ca_write:entry.data.write,
                            is_approval:entry.data.is_approval,
                            is_board:entry.data.is_board,
                            permission:entry.data.permission
                        });
                    });
                    //fire event from category container
                    me.getView().fireEvent('workgroupcomplete', subCaFieldSet);
                    me.initializeGroup(cas, subCaFieldSet, workgroup.pluginTitle, workgroup.pluginName);
                }
            });
        };
        //load subcategory of each group
        Ext.data.JsonP.request({
            url:getCategoryListApi(cId),
            success:function(response){
                var caOpt;
                var cas = [];//the second categories except for setting
                for(i=0; i<response.length; i++){//collect work categries to Array first
                    caOpt = getOption(response[i].data.ca_option);
                    if(caOpt.categoryCode == 'work' || caOpt.categoryCode == 'sales') {
                        cas.push(response[i]);
                    }
                    if(workgroup.pluginName == 'salesGroup'){//save to connect with clientList
                        Ext.getCmp('westPanel').sales.push({id:response[i].data.id, title:response[i].title});
                    }
                }
                for(i=0; i<response.length; i++){
                    caOpt = getOption(response[i].data.ca_option);
                    if(caOpt.categoryCode == 'setting'){//get presets for subcategories by setting category
                        getWGroupSetting(response[i].data.id, index, cas);
                    }
                }
            }
        });
    },

    initializeGroup: function(cateInfo, subCaFieldSet, title, pluginName) {
        var me = this;
        var gl;//group icons
        if(pluginName == 'taskGroup'){
            gl = '<img style="margin-right:5px" src="resources/images/ico_taskgroup.png">';
        }
        if(pluginName == 'salesGroup'){
            gl = '<img style="margin-right:5px" src="resources/images/ico_salesgroup.png">';
        }
        if(pluginName == 'workGroup'){
            gl = '<img style="margin-right:5px" src="resources/images/ico_workgroup.png">';;
        }
        if(pluginName == 'projectGroup'){
            gl = '<img style="margin-right:5px" src="resources/images/ico_projectgroup.png">';
        }
        /* group name of plugin in root */
        var workCon = Ext.create('Ext.panel.Panel', {
            layout: {
                type: 'vbox',
                align: 'left'
            },
            width:'100%',
            style:'margin:0 0 1px 0',
            hideCollapseTool:true,
            collapseFirst:true,
            title:gl + title,
            items:[
                {
                    xtype:'container',
                    layout: {
                        type: 'vbox',
                        align: 'left'
                    },
                    width:'100%',
                    margin:'3 0 0 0',
                    padding:'0 10 10 20',
                    itemId:'subProjectItems',
        //             cls:'workButtons',
                    title:title,
                    workCateInfo:cateInfo,
        //             style:'background-color:#1d2027'
                }
            ]
        });
        /* adding work buttons in group name */
        for(var i=0; i<cateInfo.length; i++){
            var cateOpt = getOption(cateInfo[i].data.ca_option);
            //The text for work buttons
            var unitName = (cateOpt.categoryName)? cateOpt.categoryName : cateInfo[i].title;
            //set default the displayed num of item for the generated grid
            var rows = cateInfo[i].data.page_row;
            if(rows === undefined || rows === '') rows = basicSetting.numOfItem;
            var scCss = 'style="float:right;cursor:pointer;opacity:0.3;width:8px;height:100%;text-align:center"';
            var scCval = '<div style="float:left">'+unitName+'</div>';
            scCval += '<div class="fa fa-ellipsis-v" '+scCss+' aria-hidden="true" title="'+loc.config.setShortcut+'"></div>';
            var btnWork = Ext.create('Ext.button.Button', {//buttons for component of work in accordian panel
                xtype:'button',
                text:scCval,
                ui:'plain-toolbar-small',
                index:i,
                width:'100%',
                textAlign:'left',
                unitName:unitName,
                rows:rows,
                itemId:'work_' + cateInfo[i].data.id,
                glyph:'xf016@FontAwesome',
                categoryId:cateInfo[i].data.id,
                categoryInfo:cateInfo[i].data,
                categoryOption:cateOpt,
                listeners:{
                    click:function(button, e){
                        //when click the config icon at node
                        if(e.target){//no event if excutes by shotcut
                            config.option = button.categoryOption;
                            var splash = Ext.getCmp('contentCover');
                            if(splash) splash.destroy();
                            //when click button for setting the shortcut
                            if(Ext.get(e.target).dom.className == 'fa fa-ellipsis-v'){
                                var record = Ext.data.Record.create([
                                    {name:'id'}, {name:'title'}, {name:'layout'}, {name:'icon'}, {name:'isWork'}
                                ]);
                                record.set({
                                    id:button.categoryId,
                                    title:button.unitName,
                                    displayType:button.categoryInfo.layout,
                                    icon:'columns',
                                    isWork:true
                                });

                                var tmpStr = JSON.stringify(shortcuts);
                                //check if it already has been added
                                var isExist = false;
                                if(tmpStr.indexOf('"caId":' + '"'+button.categoryId+'"') != -1){
                                    isExist = true;
                                }
                                //show deleting or adding shortcut menu
                                var menu = Ext.create('Ext.container.Container', {
                                    header:false,
                                    x:e.pageX - 5,
                                    y:e.pageY - 5,
                                    floating:true,
                                    renderTo:Ext.getBody(),
                                    layout:'vbox',
                                    items:[
                                        {
                                            xtype:'button',
                                            text:(isExist)? loc.config.delShortcut : loc.config.addShortcut,
                                            iconCls:(isExist)? 'fa fa-trash-o' : 'fa fa-bookmark-o',
                                            style:(isExist)? 'background-color:#c13518;border-color:#c13518' : '',
                                            handler:function(){
                                                var action = (isExist)? 'del' : 'add';
                                                getController('Config').addDelShortcut(record, action);
                                                menu.destroy();
                                            }
                                        }
                                    ],
                                    listeners:{
                                        render:function(comp){
                                            comp.el.on('mouseleave', function(){
                                                menu.destroy();
                                            });
                                        }
                                    }
                                });
                                return;
                            }
                        }

                        var index = (pluginName == 'taskGroup')? 0 : button.index;
                        button.fieldSet = subCaFieldSet[index];
                        currentPlugin = pluginName;
                        getController('Work').setPluginMode(button, subCaFieldSet, title, pluginName);
                        Ext.getCmp('categoryTree').getSelectionModel().deselectAll();

                        //check if shortcut info has been changed
                        for(var i=0; i<shortcuts.length; i++){
                            if(shortcuts[i].caId == button.categoryId){
                                if(shortcuts[i].caName != button.unitName){
                                    var record = Ext.data.Record.create([
                                        {name:'id'}, {name:'title'}, {name:'layout'}, {name:'icon'}, {name:'isWork'}
                                    ]);
                                    record.set({
                                        id:button.categoryId,
                                        title:button.unitName,
                                        layout:'',
                                        isWork:true,
                                        icon:shortcuts[i].icon
                                    });
                                    getController('Config').addDelShortcut(record, 'edit');
                                }
                            }
                        }

                    }
                }
            });
            workCon.down('container').insert(i, btnWork);
        }
        var itemLen = this.getView().items.items.length;
        this.getView().insert(itemLen - 1, workCon);

    }

});
