import React, {
  useImperativeHandle,
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from 'react'
import _ from 'lodash'
import Taro, { useDidShow } from '@tarojs/taro'
import { ScrollView, View } from '@tarojs/components'
import { styled } from '@linaria/react'
import { ScrollViewProps } from '@tarojs/components/types/ScrollView'

import { useTemp } from '@dseven/hooks'

export type UListRef = {
  resetContainerHeight: () => void
  handleRefresherRefresh: () => void
  setScrollTop: (value?: number) => void
}

export interface UListProps
  extends Omit<ScrollViewProps, 'refresherEnabled' | 'onRefresherRefresh'> {
  header?: React.ReactNode
  requestParams?: Record<string, any>
  serveRequest?: (
    params?: Record<string, any>
  ) => Promise<{ total: number; rows: any[] }>
  render?: (rowsData: any, index: number) => React.ReactNode
  /**
   * 设置请求返回的数量
   * */
  pageSize?: number
  /**
   * 刷新 回调
   * */
  onRefresh?: (reset: () => void) => Promise<any>
  /**
   * 下一页 回调
   * */
  onRequest?: () => void

  nodata_text?: React.ReactNode

  hideNodata?: boolean

  noData?: React.ReactNode
}

const UList = React.forwardRef<UListRef, UListProps>(
  (
    {
      children,
      style = {},
      onRefresh,
      onRequest = () => null,
      render = () => null,
      className,
      requestParams,
      serveRequest,
      pageSize = 30,
      header,
      nodata_text,
      lowerThreshold,
      onScrollToLower,
      onScroll,
      scrollTop = 0,
      hideNodata = false,
      noData,
      ...otherScrollViewProps
    },
    ref
  ) => {
    const cacheData = useTemp({
      isUnmounted: false,
      // 是否是远程
      remote: typeof serveRequest === 'function',
      // 唯一ID
      wrapperId: 'ScrollViewWrap-' + Date.now(),
      // 页面已经显示的数量
      showItemNumber: 0,
      // 刷新回调
      onRefresh,
      // 请求回调
      onRequest,
      // 分页显示数据
      pageSize,

      loading: false,
      // 总数
      total: 0,
      // 是否第一次请求
      isFirst: typeof serveRequest === 'function',
      // 是否是刷新
      isRefresh: typeof serveRequest === 'function',
      // 未显示数据 每次接口返回数据只会添加 pageSize 数量的数据，剩下的则储存出来 然后滚动展示（即前端分页）
      noDisplayData: [] as any[],

      lowerThreshold: lowerThreshold || 200,
      onScrollToLower,
      onScroll,
      tempScrollViewScrollTop: 0,
    })
    const [loading, setLoading] = useState(false)
    const [count, setCount] = useState(0)
    const [dataSource, setDataSource] = useState<any[]>([])
    const [params, setParams] = useState({
      ...requestParams,
      pageNum: 1,
    })
    const [height, setHeight] = useState(0)
    const scrollViewRef = useRef<any>(null)
    const [currentScrollTop, setCurrentScrollTop] = useState(scrollTop)

    // 截取 指定数量的 未显示数据(默认数量为设置的页面加载数量)
    const spliceNoDisplayData = useCallback(
      (size = cacheData.pageSize) => cacheData.noDisplayData.splice(0, size),
      [cacheData]
    )

    const resetContainerHeight = useCallback(() => {
      setTimeout(() => {
        // 计算高度
        const query = Taro.createSelectorQuery()
        query
          .select(`#${cacheData.wrapperId}`)
          .boundingClientRect((rect) => {
            if (cacheData.isUnmounted) return
            setHeight(rect.height || 0)
          })
          .exec()
      }, 100)
    }, [cacheData])

    // 刷新函数
    const handleRefresherRefresh = useCallback(async () => {
      cacheData.isRefresh = true
      await cacheData.onRefresh?.(() => setCount((v) => v + 1))

      // 远程刷新 则重新赋值  请求数据
      if (cacheData.remote) setParams({ ...requestParams, pageNum: 1 })
    }, [cacheData, requestParams, setParams, setCount])

    // 加载下一页函数
    const handleScrollToLower = useCallback(
      async (event) => {
        // 正在请求中 则返回
        if (cacheData.loading) return

        cacheData.onScrollToLower?.(event)

        const spliceData = spliceNoDisplayData()
        if (spliceData.length) {
          setDataSource((oldData) => {
            const newData = [...oldData, ...spliceData]
            cacheData.showItemNumber = newData.length

            return newData
          })
        }

        setTimeout(() => {
          // 如果截取的为显示数据数量 大于 指定分页的展示数量 则返回 不请求数据
          if (spliceData.length >= cacheData.pageSize) return

          /**
           * 总数大于已展示的数量和未展示的数量之和  则 可以进行下一步
           *
           */
          if (
            cacheData.total >
            cacheData.showItemNumber + cacheData.noDisplayData.length
          ) {
            setParams((oldData) => {
              return {
                ...oldData,
                pageNum: oldData.pageNum + 1,
              }
            })
            cacheData.onRequest?.()
          }
        }, 0)
      },
      [cacheData, setParams, spliceNoDisplayData]
    )

    const newProps = useMemo(() => {
      return {
        onRefresherRefresh: handleRefresherRefresh,
        refresherEnabled: cacheData.remote,
        onScroll: _.debounce((event) => {
          cacheData.onScroll?.(event)
          cacheData.tempScrollViewScrollTop = event.detail.scrollTop
        }, 800),
        ...(currentScrollTop ? { scrollTop: currentScrollTop } : {}),
        ...(cacheData.remote
          ? {
              onScrollToLower: handleScrollToLower,
              lowerThreshold: cacheData.lowerThreshold,
            }
          : {}),
      }
    }, [
      cacheData,
      handleRefresherRefresh,
      handleScrollToLower,
      currentScrollTop,
    ])

    const setScrollTop: UListRef['setScrollTop'] = useCallback(
      (value) => {
        setCurrentScrollTop(value || cacheData.tempScrollViewScrollTop)
      },
      [cacheData]
    )

    useImperativeHandle(ref, () => ({
      resetContainerHeight,
      handleRefresherRefresh,
      setScrollTop,
    }))

    useEffect(() => {
      resetContainerHeight()
    }, [resetContainerHeight])

    useEffect(() => {
      // 远程刷新并且不是第一次进入 则重新赋值  请求数据
      if (cacheData.remote && !cacheData.isFirst) {
        cacheData.isFirst = true
        cacheData.isRefresh = true
        setParams({ ...requestParams, pageNum: 1 })
      }
    }, [requestParams, cacheData, setParams])

    useEffect(() => {
      if (cacheData.remote) {
        cacheData.loading = true
        setLoading(true)
        if (cacheData.isFirst) {
          Taro.showLoading({
            title: 'Loading',
          })
        }

        Taro.showNavigationBarLoading?.()

        const { isRefresh } = cacheData
        serveRequest?.({ ...params, pageSize: cacheData.pageSize })
          ?.then((data) => {
            cacheData.total = data.total
            if (isRefresh) {
              cacheData.noDisplayData = data.rows || []
              const newData = spliceNoDisplayData()
              cacheData.showItemNumber = newData.length

              setDataSource(newData)
            } else {
              cacheData.noDisplayData.push(...(data.rows || []))
              setDataSource((oldData) => {
                const newData = [...oldData, ...spliceNoDisplayData()]
                cacheData.showItemNumber = newData.length
                return newData
              })
            }
          })
          .finally(() => {
            cacheData.isFirst = false
            cacheData.loading = false
            cacheData.isRefresh = false

            setLoading(false)
            Taro.hideLoading()

            Taro.hideNavigationBarLoading?.()

            if (isRefresh) {
              // 复位
              setCount((v) => v + 1)
            }
          })
      }

      return () => {
        cacheData.isUnmounted = true
      }
    }, [
      serveRequest,
      params,
      cacheData,
      setCount,
      spliceNoDisplayData,
      setLoading,
    ])

    useDidShow(() => setCount((v) => v + 1))

    return (
      <StyledWrap className={className} id={cacheData.wrapperId} style={style}>
        <ScrollView
          {...otherScrollViewProps}
          ref={scrollViewRef}
          scrollY
          key={count}
          style={{ height }}
          {...newProps}
        >
          {header}
          {children || (
            <>
              {dataSource.map(render)}
              {!hideNodata &&
                !cacheData.isFirst &&
                !cacheData.isRefresh &&
                !loading &&
                !dataSource.length &&
                noData}
            </>
          )}
        </ScrollView>
      </StyledWrap>
    )
  }
)

export default UList

const StyledWrap = styled(View)`
  flex-grow: 1;
  flex: 1;
  overflow: hidden;

  taro-scroll-view-core {
    height: 100%;
  }
`
