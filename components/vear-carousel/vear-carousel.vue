<template>
	<swiper class="image-container" previous-margin="45rpx" next-margin="45rpx" circular autoplay @change="swiperChange" s>
		<swiper-item :class="currentIndex == index ? 'swiper-item' : 'swiper-item-side'" v-for="(item, index) in imgList" :key="item[urlKey]" @tap="previewImage(index)" >
			<image @click="clickImg(item)" :class="currentIndex == index ? 'item-img' : 'item-img-side'" :src="item[urlKey]" lazy-load :style="dontFirstAnimation ? 'animation: none;' : ''" mode="aspectFill"></image>
		</swiper-item>
	</swiper>
</template>
<script>
	export default {
		props: {
			imgList: {
				type: Array,
				default() {
					return []
				}
			},
			urlKey: {
				type: String,
				default() {
					return ''
				}
			},
		},
		data() {
			return {
				currentIndex: 0,
				dontFirstAnimation: true
			}
		},
		methods: {
			swiperChange(e) {
				this.dontFirstAnimation = false
				this.currentIndex = e.detail.current
			},
			clickImg(item) {
				this.$emit('selected', item, this.currentIndex)
			},
			previewImage(index){
				//console.log(this.imgList[index].url)
				var i =this.imgList[index].url  //获取当前页面的轮播图数据
						//uniapp预览轮播图
						uni.previewImage({
							current:index, //预览图片的下标
							urls:[i ]//预览图片的地址，必须要数组形式，如果不是数组形式就转换成数组形式就可以
						})
			}
		}
	}
</script>
<style scoped>
	.image-container {
		width: 100%;
		height: 510upx;
	}

	.item-img {
		width: 285upx;
		height: 501upx;
		border-radius: 14rpx;
		animation: to-big .3s;
	}

	.swiper-item {
		width: 285upx;
		height: 501upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.item-img-side {
		width:2000upx;
		height:460upx;
		border-radius: 14rpx;
		animation: to-mini .3s;
	}

	.swiper-item-side {
		width: 2000upx;
		height:480upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	@keyframes to-mini
	{
		from {
			height: 501upx;
		}
		to {
			height: 480upx;
		}
	}
	@keyframes to-big
	{
		from {
			height: 480upx;
		}
		to {
			height: 501upx;
		}
	}
</style>
