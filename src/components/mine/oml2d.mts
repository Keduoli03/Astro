import { siteConfig } from "@/config";
import { modelList } from "./live2d.astro.0.mts";

export const oml2d =
	siteConfig.live2d.enable &&
	loadOml2d({
		dockedPosition: "right",
		models: modelList,
		mobileDisplay: false,
		statusBar: {
			restMessage: "看板娘休息中",
			loadingIcon: "icon-loading",
		},
		tips: {
			// 添加样式配置
			style: {
				top: "-25px",
				fontSize: "12px",
				// 或者使用 transform
				transform: "translateY(-10px) translateX(15px)", // Y轴上移，X轴右移

				// 或者使用 marginLeft
				marginLeft: "15px", // 右边距15px
			},
			idleTips: {
				wordTheDay(wordTheDayData) {
					return `${wordTheDayData.hitokoto}  by.${wordTheDayData.from}`;
				},
			},
		},
		// Menu configuration with all items
		menus: {
			disable: false,
			// 添加样式配置，让菜单往右移动
			style: {
				transform: "translateX(10px)", // 距离右边的距离，可以调整数值
				// 或者使用 left 属性
				// left: '300px'  // 距离左边的距离
			},
			items: [
				{
					id: "hitokoto",
					title: "一言",
					icon: "icon-like",
					onClick(oml2d) {
						// 定义API源配置（按优先级排序）
						const API_SOURCES = [
							{
								url: "https://international.v1.hitokoto.cn",
								parser: (data) => `${data.hitokoto} —— ${data.from}`,
							},
							{
								url: "https://v1.hitokoto.cn?encode=json&charset=utf-8",
								parser: (data) => `${data.hitokoto} —— ${data.from}`,
							},
							{
								url: "https://hitokoto.icodeq.com/api",
								parser: (data) =>
									`${data.sentence} —— ${data.author || "未知"}`,
							},
							{
								url: "https://api.a632079.me/hitokoto",
								parser: (data) =>
									`${data.content} —— ${data.creator || "未知"}`,
							},
						];

						// 显示错误信息的工具函数
						const showError = () => {
							oml2d.tipsMessage("所有数据源均请求失败", 3000, 9);
						};

						// 带降级策略的请求函数
						const fetchWithFallback = async (index = 0) => {
							// 所有数据源都尝试过仍失败
							if (index >= API_SOURCES.length) {
								showError();
								return;
							}

							try {
								const source = API_SOURCES[index];
								const response = await fetch(source.url, {
									headers: { Accept: "application/json" },
									referrerPolicy: "no-referrer-when-downgrade",
								});

								// 检查HTTP响应状态
								if (!response.ok) {
									throw new Error(`HTTP ${response.status}`);
								}

								// 解析响应并显示结果
								const data = await response.json();
								oml2d.tipsMessage(source.parser(data), 4000, 10);
							} catch (error) {
								// 尝试下一个数据源
								fetchWithFallback(index + 1);
							}
						};

						// 启动请求流程
						fetchWithFallback();
					},
				},
				{
					id: "switch-skin",
					title: "换衣服",
					icon: "icon-skin",
					onClick(oml2d) {
						oml2d.loadNextModelClothes();
					},
				},
				{
					id: "switch-model",
					title: "切换模型",
					icon: "icon-switch",
					onClick(oml2d) {
						oml2d.loadNextModel();
					},
				},
				{
					id: "rest",
					title: "休息",
					icon: "icon-rest",
					onClick(oml2d) {
						oml2d.stageSlideOut();
						// 设置状态栏点击事件，让模型重新显示
						oml2d.setStatusBarClickEvent(() => {
							oml2d.stageSlideIn();
						});
					},
				},
				{
					id: "about",
					title: "About",
					icon: "icon-about",
					onClick(oml2d) {
						window.open(
							"https://github.com/oh-my-live2d/oh-my-live2d",
							"_blank",
						);
					},
				},
			],
		},
		primaryColor: "var(--primary)",
		sayHello: true,
	});
