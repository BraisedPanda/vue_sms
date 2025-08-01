
import { VxeUI } from 'vxe-table'

VxeUI.setConfig({
    // size: null, // 全局尺寸
    // zIndex: 999, // 全局 zIndex 起始值，如果项目的的 z-index 样式值过大时就需要跟随设置更大，避免被遮挡；新版本可以使用 dom-zindex 共享配置
    // version: 1, // 版本号，对于某些带数据缓存的功能有用到，上升版本号可以用于重置数据

    emptyCell: '　',
    table: {
        showHeader: true,
        delayHover: 250,
        autoResize: true,
        minHeight: 144,
        // keepSource: false,
        // showOverflow: null,
        // showHeaderOverflow: null,
        // showFooterOverflow: null,
        // resizeInterval: 500,
        // size: null,
        // zIndex: null,
        // stripe: false,
        // border: false,
        // round: false,
        // emptyText: '暂无数据',
        // emptyRender: {
        //   name: ''
        // },
        // rowConfig: {
        //   keyField: '_X_ROW_KEY' // 行数据的唯一主键字段名
        // },
        resizeConfig: {
            // refreshDelay: 20
        },
        resizableConfig: {
            dragMode: 'auto',
            showDragTip: true,
            isSyncAutoHeight: true,
            isSyncAutoWidth: true,
            minHeight: 18
        },
        radioConfig: {
            // trigger: 'default'
            strict: true
        },
        rowDragConfig: {
            showIcon: true,
            showGuidesStatus: true,
            showDragTip: true
        },
        columnDragConfig: {
            showIcon: true,
            showGuidesStatus: true,
            showDragTip: true
        },
        checkboxConfig: {
            // trigger: 'default',
            strict: true
        },
        tooltipConfig: {
            enterable: true
        },
        validConfig: {
            showMessage: true,
            autoClear: true,
            autoPos: true,
            message: 'inline',
            msgMode: 'single',
            theme: 'beautify'
        },
        columnConfig: {
            maxFixedSize: 4
        },
        cellConfig: {
            padding: true
        },
        headerCellConfig: {
            height: 'unset'
        },
        footerCellConfig: {
            height: 'unset'
        },
        // menuConfig: {
        //   visibleMethod () {}
        // },
        customConfig: {
            // enabled: false,
            allowVisible: true,
            allowResizable: true,
            allowFixed: true,
            allowSort: true,
            showFooter: true,
            placement: 'top-right',
            //  storage: false,
            //  checkMethod () {},
            modalOptions: {
                showMaximize: true,
                mask: true,
                lockView: true,
                resize: true,
                escClosable: true
            },
            drawerOptions: {
                mask: true,
                lockView: true,
                escClosable: true,
                resize: true
            }
        },
        sortConfig: {
            // remote: false,
            // trigger: 'default',
            // orders: ['asc', 'desc', null],
            // sortMethod: null,
            showIcon: true,
            allowClear: true,
            allowBtn: true,
            iconLayout: 'vertical'
        },
        filterConfig: {
            // remote: false,
            // filterMethod: null,
            // destroyOnClose: false,
            // isEvery: false,
            showIcon: true
        },
        treeConfig: {
            rowField: 'id',
            parentField: 'parentId',
            childrenField: 'children',
            hasChildField: 'hasChild',
            mapChildrenField: '_X_ROW_CHILD',
            indent: 20,
            showIcon: true
        },
        expandConfig: {
            // trigger: 'default',
            showIcon: true,
            mode: 'fixed'
        },
        editConfig: {
            // mode: 'cell',
            showIcon: true,
            showAsterisk: true,
            autoFocus: true
        },
        importConfig: {
            _typeMaps: {
                csv: 1,
                html: 1,
                xml: 1,
                txt: 1
            }
        },
        exportConfig: {
            _typeMaps: {
                csv: 1,
                html: 1,
                xml: 1,
                txt: 1
            }
        },
        printConfig: {
        },
        mouseConfig: {
            extension: true
        },
        keyboardConfig: {
            isEsc: true
        },
        areaConfig: {
            autoClear: true,
            selectCellByHeader: true,
            selectCellByBody: true,
            extendDirection: {
                top: true,
                left: true,
                bottom: true,
                right: true
            }
        },
        clipConfig: {
            isCopy: true,
            isCut: true,
            isPaste: true
        },
        fnrConfig: {
            isFind: true,
            isReplace: true
        },
        virtualXConfig: {
            enabled: true,
            gt: 60,
            preSize: 0,
            oSize: 1
        },
        virtualYConfig: {
            enabled: true,
            gt: 100,
            preSize: 1,
            oSize: 2
        },
        scrollbarConfig: {
            // width: 0,
            // height: 0
        }
    },
    // export: {
    //   types: {}
    // },
    grid: {
        // size: null,
        // zoomConfig: {
        //   escRestore: true
        // },
        formConfig: {
            enabled: true
        },
        pagerConfig: {
            enabled: true
            // perfect: false
        },
        toolbarConfig: {
            enabled: true
            // perfect: false
        },
        proxyConfig: {
            enabled: true,
            autoLoad: true,
            showResponseMsg: true,
            showActiveMsg: true,
            props: {
                list: null,
                result: 'result',
                total: 'page.total',
                message: 'message'
            }
            // beforeItem: null,
            // beforeColumn: null,
            // beforeQuery: null,
            // afterQuery: null,
            // beforeDelete: null,
            // afterDelete: null,
            // beforeSave: null,
            // afterSave: null
        }
    },
    toolbar: {
        // size: null,
        // import: {
        //   mode: 'covering'
        // },
        // export: {
        //   types: ['csv', 'html', 'xml', 'txt']
        // },
        // buttons: []
    }
})
