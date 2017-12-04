/*
 * File: app/view/HistoryWindowViewController.js
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

Ext.define('Actor.view.HistoryWindowViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.historywindow',

    showChanged: function(store, gridView, show) {
        var bgColor = (show)? '#ffe3cd': '#ffffff';
        store.each(function(record, index){
            var preRec = store.getRange(index + 1, index + 1);
            if(preRec.length > 0){
                if(record.get('bd_subject') != preRec[0].get('bd_subject')){
                    Ext.get(gridView.getNodes(index, index)[0]).el.select('.gsubject').elements[0].style.backgroundColor = bgColor;
                }
                if(record.get('bd_content') != preRec[0].get('bd_content')){
                    Ext.get(gridView.getNodes(index, index)[0]).el.select('.gcontent').elements[0].style.backgroundColor = bgColor;
                }
                if(record.get('idx') != preRec[0].get('idx')){
                    Ext.get(gridView.getNodes(index, index)[0]).el.select('.gidx').elements[0].style.backgroundColor = bgColor;
                }
                Ext.Array.each(preRec[0].data.bd_data, function(entry, i){
                    if(record.get('bd_data')[i].data_val != entry.data_val){//exclude 'auto numbering field'
                        var idx = '.id' + record.get('bd_data')[i].cols_idx;
                        if(Ext.get(gridView.getNodes(index, index)[0]).el.select(idx).elements[0])
                            Ext.get(gridView.getNodes(index, index)[0]).el.select(idx).elements[0].parentElement.style.backgroundColor = bgColor;
                    }
                });
            }
        });
    },

    onShowChangedChange: function(field, newValue, oldValue, eOpts) {
        var grid = field.up('window').down('grid');
        this.showChanged(grid.getStore(), grid.getView(), newValue);
    },

    onHistoryWindowAdd: function(container, component, index, eOpts) {
        if(component.xtype == 'bordersplitter'){
            component.width = 3;
            component.setStyle('background-color', '#d9dbdf');
        }
    }

});
