/*
 * File: app/view/ColorPickerWindowViewController.js
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

Ext.define('Actor.view.ColorPickerWindowViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.colorpickerwindow',

    onWindowBeforeRender: function(component, eOpts) {
        var record=component.getRecord();
        var idx=component.getIdx();
        /*       var colorpicker=Ext.create("Ext.ux.colorpick.Selector",{
        value:record.get("color"),
        width:'100%',
        height:'100%'
        });*/

        component.add({
            xtype:'colorselector',
            width:'100%',
            value:record.get("color")[idx].color
        });
        component.add({
            xtype:'buttongroup',
            items:[
            {
                text:loc.config.apply,
                listeners:{
                    click:function(button, e, eOpts ) {
                        button.up('window').close();
                    }
                }

            },
            {
                text:loc.upload.cancel,
                listeners:{
                    click:function(button, e, eOpts ) {
                        var form=Ext.getCmp("color_window").down("form");
                        var window=button.up('window');
                        var idx=window.getIdx();
                        var oriColors = window.originalColors[idx];
                        var record=window.getRecord();
                        var colors=record.get("color");
                        var ori_color=oriColors.color;
                        colors[idx].color=ori_color;
                        record.set('name', oriColors.name);
                        record.set('color', colors);
                        var dataview=Ext.getCmp("color_window").down("dataview");
                        dataview.refresh();
                        window.close();
                        form.mask('취소 중입니다.');
                        if(record.get('check')===true) setTimeout(form.setAllChangeColor, 300, form.originalColor.color, window.originalColors);
                    }
                }

            }
            ]
        });

    }

});
