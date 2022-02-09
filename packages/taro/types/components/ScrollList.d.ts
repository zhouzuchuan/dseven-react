import React from 'react';
import { ScrollViewProps } from '@tarojs/components/types/ScrollView';
export declare type ScrollListRef = {
    resetContainerHeight: () => void;
    handleRefresherRefresh: () => void;
    setScrollTop: (value?: number) => void;
};
export interface ScrollListProps extends Omit<ScrollViewProps, 'refresherEnabled' | 'onRefresherRefresh'> {
    header?: React.ReactNode;
    requestParams?: Record<string, any>;
    serveRequest?: (params?: Record<string, any>) => Promise<{
        total: number;
        rows: any[];
    }>;
    render?: (rowsData: any, index: number) => React.ReactNode;
    /**
     * 设置请求返回的数量
     * */
    pageSize?: number;
    /**
     * 刷新 回调
     * */
    onRefresh?: (reset: () => void) => Promise<any>;
    /**
     * 下一页 回调
     * */
    onRequest?: () => void;
    noData?: React.ReactNode;
}
declare const ScrollList: React.ForwardRefExoticComponent<Pick<ScrollListProps, "key" | "id" | "animation" | "hidden" | "header" | "style" | "className" | "scrollLeft" | "scrollTop" | "scrollIntoView" | "scrollX" | "scrollY" | "render" | "dangerouslySetInnerHTML" | "onClick" | "onDragEnd" | "onDragStart" | "onTouchCancel" | "onTouchEnd" | "onTouchMove" | "onTouchStart" | "onScroll" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration" | "onTransitionEnd" | "onLongPress" | "onLongClick" | "onTouchForceChange" | "upperThreshold" | "lowerThreshold" | "scrollWithAnimation" | "enableBackToTop" | "enableFlex" | "scrollAnchoring" | "refresherThreshold" | "refresherDefaultStyle" | "refresherBackground" | "refresherTriggered" | "enhanced" | "bounces" | "showScrollbar" | "pagingEnabled" | "fastDeceleration" | "onScrollToUpper" | "onScrollToLower" | "onRefresherPulling" | "onRefresherRestore" | "onRefresherAbort" | "onDragging" | "requestParams" | "serveRequest" | "pageSize" | "onRefresh" | "onRequest" | "noData"> & React.RefAttributes<ScrollListRef>>;
export default ScrollList;
