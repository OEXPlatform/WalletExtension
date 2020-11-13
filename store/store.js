import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.Store({  
    state: { 
				Wallet:"",
				assetsList:[]
    },
		getters:{
			getWallet: state =>{
				return state.Wallet;
			},
			getAssetsList: state =>{
				return state.assetsList
			}
		},
    mutations: {  
			 setWallet(state,Wallet){
				 state.Wallet = Wallet;
			 },
			 setAssetsList(state,assetsList){
				 state.assetsList = assetsList;
			 }
    },
		actions:{
		}
		
})
export default store
