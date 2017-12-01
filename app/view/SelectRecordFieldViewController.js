/*
 * File: app/view/SelectRecordFieldViewController.js
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

Ext.define('Actor.view.SelectRecordFieldViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.selectrecordfield',

    onBtnSelectClick: function(button, e, eOpts) {
        var me = this;
        var rId = button.connectCategory;
        var grpWin = Ext.create(appName + '.view.DataGroupWindow', {
            scrollable:true,
            cls:'upload-form',
            modal:true,
            fieldId:button.fieldId,
            maxHeight:windowMaxHeight - 30,
            relatedCategory:rId
        }).show();

        var dgGrid = grpWin.down('#dgGrid');
        dgGrid.on('cellclick', function(tableview, dgTd, cellIndex, rec){
            var value;
            var fileVal = '';
            var fieldId = grpWin.fieldId;
            if(rec.get('bd_file').length > 0){
                fileVal = rec.get('bd_file')[0].thumb_path;
                fileVal += '?file_name=' + encodeURIComponent(rec.get('bd_file')[0].file_name);
                fileVal += '--bd_subject=' + encodeURIComponent(rec.get('bd_subject'));
                fileVal += '--bd_idx=' + rec.get('bd_idx');//for downloading
            }
            value = rec.data;
            var obj = {};
            obj['record_' + rId] = value;
            obj['file_' + rId] = fileVal;
            var img = button.up('container').down('image');//image component in SelectRecordField
            if(button.fieldId == 'bd_file'){//when bd_file selected, set src to image
                img.setSrc(fileVal);
            }
            button.up('window').getViewModel().setData(obj);
            grpWin.close();

        });
    }

});
