/*
 * File: app/view/CategoryContainer.js
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

Ext.define('Actor.view.CategoryContainer', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.categorycontainer',

    requires: [
        'Actor.view.CategoryContainerViewModel',
        'Actor.view.CategoryContainerViewController',
        'Ext.panel.Panel',
        'Ext.button.Button'
    ],

    controller: 'categorycontainer',
    viewModel: {
        type: 'categorycontainer'
    },
    id: 'categoryContainer',
    width: '100%',
    bodyPadding: 0,
    frameHeader: false,
    header: false,
    title: 'My Panel',

    layout: {
        type: 'accordion',
        fill: false,
        collapseFirst: true,
        animate: true
    },
    items: [
        {
            xtype: 'panel',
            cls: 'message-header',
            itemId: 'messageBox',
            style: {
                margin: '0 0 1px 0'
            },
            bodyPadding: '10 0 10 10',
            collapsed: true,
            hideCollapseTool: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            bind: {
                title: '{message}'
            },
            items: [
                {
                    xtype: 'container',
                    itemId: 'messageInContainer',
                    items: [
                        {
                            xtype: 'button',
                            handler: function(button, e) {
                                getController('Message').viewMessage('in');
                            },
                            itemId: 'btnMessageIn',
                            ui: 'plain-toolbar-small',
                            glyph: 'xf24a@FontAwesome',
                            bind: {
                                text: '{messageIn}'
                            }
                        },
                        {
                            xtype: 'component',
                            itemId: 'unReadMessages',
                            style: {
                                display: 'inline-block',
                                'margin-left': '4px',
                                color: '#5e93bb'
                            }
                        }
                    ]
                },
                {
                    xtype: 'button',
                    handler: function(button, e) {
                        getController('Message').viewMessage('out');
                    },
                    flex: 1,
                    itemId: 'btnMessageOut',
                    ui: 'plain-toolbar-small',
                    glyph: 'xf24a@FontAwesome',
                    bind: {
                        text: '{messageOut}'
                    }
                }
            ]
        },
        {
            xtype: 'panel',
            id: 'documentBox',
            itemId: 'documentBox',
            style: {
                margin: '0 0 1px 0'
            },
            userCls: 'message-header',
            bodyPadding: '10 0 10 10',
            collapsed: true,
            hideCollapseTool: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            bind: {
                title: '{documentBox}'
            },
            items: [
                {
                    xtype: 'container',
                    itemId: 'documentInContainer',
                    items: [
                        {
                            xtype: 'button',
                            handler: function(button, e) {
                                getController('Message').viewMessage('in', 'doc');
                            },
                            itemId: 'btnDocumentIn',
                            ui: 'plain-toolbar-small',
                            glyph: 'xf24a@FontAwesome',
                            bind: {
                                text: '{documentIn}'
                            }
                        },
                        {
                            xtype: 'component',
                            itemId: 'unReadDocMessages',
                            style: {
                                display: 'inline-block',
                                'margin-left': '4px',
                                color: '#5e93bb'
                            }
                        }
                    ]
                },
                {
                    xtype: 'button',
                    handler: function(button, e) {
                        getController('Message').viewMessage('out', 'doc');
                    },
                    flex: 1,
                    itemId: 'btnDocumentOut',
                    ui: 'plain-toolbar-small',
                    glyph: 'xf24a@FontAwesome',
                    bind: {
                        text: '{documentOut}'
                    }
                }
            ]
        }
    ]

});