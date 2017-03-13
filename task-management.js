//运用localStorage储存list数据
var store={
	save:function(key,value){
		localStorage.setItem(key,JSON.stringify(value));
	},
	get:function(key){
		return JSON.parse(localStorage.getItem(key))||[];
	}
}

//获取全部任务
var list=store.get("task-management");

//过滤列表函数
var filter={
	all:function(list){
		return list;
	},
	unfinished:function(list){
		return list.filter(function(item){
			return !item.isChecked;
		})
	},
	finished:function(list){
		return list.filter(function(item){
			return item.isChecked;
		})
	}
}


var vm=new Vue({
	el:'.main',
	data:{
		list:list,
		task:"",
		editingTask:{},//用于储存被双击（被编辑）的列表项
		beforeTitle:"",
		filterCondition:""
	},
	watch:{
		list:{
			handler:function(){
				store.save("task-management",this.list);
			},
			deep:true //
		}
	},
	computed:{
		unfinished:function(){
			return this.list.filter(function (item){
				return !item.isChecked
			}).length
		},
		filteredList:function(){
			return filter[this.filterCondition]?filter[this.filterCondition](this.list):this.list
		}
	},
	methods:{
		addTask:function(){
			this.list.push({
				title:this.task,
				isChecked:false
			});
			
			this.task="";
		},
		deleteTask:function(item){
			var index=this.list.indexOf(item);
			this.list.splice(index,1);
		},
		editTask:function(item){
			this.beforeTitle=item.title;
			this.editingTask=item;
		},
		finishTask:function(){
			this.editingTask="";
		},
		cancelEdit:function(item){
			item.title=this.beforeTitle;
			this.beforeTitle='';
			this.editingTask="";
		}
	},
	directives:{
		"focus":{
			update:function(el,binding){
				if(binding.value){
					el.focus();
				}
			}
		}
	}
});

//当hash值变化时储存hash值到变量filterCondition中
function storeHash(){
	var hash=window.location.hash.slice(1);
	vm.filterCondition=hash;
}

window.addEventListener('hashchange',storeHash);

