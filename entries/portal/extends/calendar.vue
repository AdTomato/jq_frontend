<template>
  <div class="hello">
    <el-calendar v-model="value" id="calendar">
          <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
          <template
           slot="dateCell"
           slot-scope="{date, data}" > 
            <!--自定义内容-->
              <div >
                 <div class="calendar-day" @click="addGoodsHandler(data.day.split('-').slice(2).join('-'),data.day.split('-'))">{{ data.day.split('-').slice(2).join('-') }}</div>
                    <div v-for="(item,index) in calendarData" :key="index" >
                       <div v-if="(item.months).indexOf(data.day.split('-').slice(1)[0])!=-1">
                         <div v-if="(item.days).indexOf(data.day.split('-').slice(2).join('-'))!=-1">
                              <el-tooltip class="item" effect="dark" :content="item.things" placement="right">
                                   <div class="is-selected" @click="addGoodsHandler(data.day.split('-').slice(2).join('-'),data.day.split('-'))">{{item.things}}</div>
                              </el-tooltip>
                           </div>
                        <div v-else></div>
                       </div>
                   <div v-else></div>
                 </div>
              </div>
          </template>
    </el-calendar>
    <el-dialog title="设置日程" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="日程内容" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" ref="schedule" ></el-input>
        </el-form-item>
        <el-form-item label="日程类型" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择日程类型" @change='getValue'>
            <el-option label="内勤" value="内勤"></el-option>
            <el-option label="请假" value="请假"></el-option>
            <el-option label="出差" value="出差"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设置关联项目" :label-width="formLabelWidth" v-if="show">
            <el-radio type="radio" name="test" @change='test' v-for="(item,index) in list" :key="index" :value="item.value" :label="item.label" v-model="checkedValue"></el-radio>
            <!-- <el-radio label="2" value = "产品研发">产品研发</el-radio> -->
          
        </el-form-item>

        <el-form-item label="" :label-width="formLabelWidth" v-if="product_show">
          <el-select v-model="form.product" placeholder="请选择" @change="selectModel($event)">
            <el-option  v-for="(item,index) in infoList" :key="index" :value="item.value" :label="item.label"></el-option>
            <!-- <el-option label="选项二" value="5"></el-option>
            <el-option label="选项三" value="6"></el-option> -->
          </el-select>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import Vue from 'vue';
  import ElementUI from 'element-ui';
  import 'element-ui/lib/theme-chalk/index.css';
  import axios from 'axios';
  Vue.use(ElementUI,axios);
  export default{
    name: 'calendar',
    data(){
      return{
        calendarData:'',
        value: new Date(),
        dialogTableVisible: false,
        dialogFormVisible: false,
        show:false,
        product_show:false,
        form: {
          name: '',
          region: '',
          product:'',
        },
        checkedValue:'',
        list:[{value:1,label:'合同名称'},{value:2,label:'产品研发'}],
        infoList:'',
        formLabelWidth: '120px',
        url:'http://60.168.132.92:1217/api',
        relatedId:'',
        day:''
        
      }
    },
    methods: {

      //选择关联项目
      test(){
        console.log('被选中的值为:'+this.checkedValue);
        if(this.checkedValue == "合同名称"){
          this.infoList = [];
          this.getInfo();
        }else if(this.checkedValue == "产品研发"){
          this.infoList = [];
          this.getProduct();
        }else{
          console.log("关联项目不存在")
        }
      },

      // 点击弹窗
      addGoodsHandler (day,month) {
        console.log("month=",month)
        let userId=JSON.parse(sessionStorage.getItem("user")).id; 
        this.day = "";
        this.day = day;
        this.dialogFormVisible = true;
        //获取一条数据方法；
        // axios.get(this.url+'/controller/calendar/getOneDayCalendar?userId='+userId+'&year=2020&month='+month[1]+'&day='+day)
        //   .then((response) => {
        //     debugger;
        //       if(response.errcode==0){
        //         if(response.data!=undefined){
        //             this.setData(response.data);
        //         }else{
        //           console.log("未查询到当天数据");
        //         }
        //       }
        //   })
      },

      setData:function(res){
        this.form.name = "";
        this.form.region = "";
        this.checkedValue = "";
        this.form.name = res.workContent;
        this.form.region = res.dayType;
        this.checkedValue = res.workSetting;
      },

      selectModel(id){
          this.relatedId = "";
          this.relatedId = id;
      },

      //获取页面选择的值
      getValue: function(){
          console.log('您选择了', this.form.region);
          if(this.form.region=="内勤"){
            this.show = true;
            this.product_show = true;
          }else if(this.form.region=="请假"){
            this.show = false;
            this.product_show = false;
          }else if(this.form.region=="出差"){
            this.show = true;
            this.product_show = true;
          }
      },
      //设置日程
      submit(){
        var array = [];
        let userId=JSON.parse(sessionStorage.getItem("user")).id; 
        if(userId!=null&&userId!=undefined){
          var year = this.dateFormat("YYYY", this.value);
          var month = this.dateFormat("mm", this.value);
          console.log("this.form=",this.form)
          var dayType =  this.form.region;
          let workContent = this.$refs.schedule.value;
          if(workContent==""){
            this.$message({
                message: '请填写相关日程',
                type: 'warning'
              });
          }
          var obj = {};
          obj.person = userId;
          obj.year = year;
          obj.month = month;
          obj.day = this.day;
          obj.dayType = dayType;
          obj.workSetting = this.checkedValue;
          obj.workContent = workContent;
          obj.relatedId = this.relatedId;
          array.push(obj);
          this.dialogFormVisible = false ;
          axios.put(this.url+'/controller/calendar/updateCalendar',array)
          .then((response) => {
            debugger;
              if(response.errcode==0){
                console.log("response=",response);
                this.calendarData = response.data;
                this.$message({
                  message: '设置成功',
                  type: 'success'
                });
              }
          })
        }else{
          this.$message({
            message: '未获取到用户id！错误：用户信息不存在',
            type: 'warning'
          });

        }
        
      },


      //获取合同id 和name
      getInfo(){
        axios.get(this.url+'/controller/contract/getContractNameAndIdList')
        .then((response) => {
            if(response.errcode==0){
              console.log(response);
              var arr  = [];
              for(var i=0;i<response.data.length;i++){
                var obj = new Object();
                obj.label = response.data[i].contractName;
                obj.value = response.data[i].id;
                arr.push(obj);
              }
              console.log("arr==",arr)
              this.infoList = arr;
            }
        })
      },

      //获取产品id 和name
      getProduct(){
        axios.get(this.url+'/controller/product/getProductNameAndIdList')
        .then((response) => {
            if(response.errcode==0){
              console.log(response);
              var arr  = [];
              for(var i=0;i<response.data.length;i++){
                var obj = new Object();
                obj.label = response.data[i].productName;
                obj.value = response.data[i].id;
                arr.push(obj);
              }
              this.infoList = arr;
            }
        })
      },


      //封装时间格式化方法
      dateFormat(fmt, date) {
          let ret;
          const opt = {
              "Y+": date.getFullYear().toString(),        // 年
              "m+": (date.getMonth() + 1).toString(),     // 月
              "d+": date.getDate().toString(),            // 日
              "H+": date.getHours().toString(),           // 时
              "M+": date.getMinutes().toString(),         // 分
              "S+": date.getSeconds().toString()          // 秒
              // 有其他格式化字符需求可以继续添加，必须转化成字符串
          };
          for (let k in opt) {
              ret = new RegExp("(" + k + ")").exec(fmt);
              if (ret) {
                  fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length)))
              };
          };
          return fmt;
      },


      //默认加载当月数据
      loadDate(){
        let userId=JSON.parse(sessionStorage.getItem("user")).id; 
        if(userId!=null&&userId!=undefined){
          var year = this.dateFormat("YYYY", new Date());
          var month = this.dateFormat("mm", new Date());
          debugger;
          axios.get(this.url+'/controller/calendar/getOneMonthCalendar?userId='+userId+'&year='+year+'&month='+month)
          .then((response) => {
            debugger;
              if(response.errcode==0){
                console.log("response=",response.data);
                this.calendarData = response.data;
              }
          })
        }else{
          this.$message({
            message: '未获取到用户id！错误：用户信息不存在',
            type: 'warning'
          });
        }

      }

        
      },
      
      mounted:function(){
        this.loadDate();
      },
      watch: {
          // 如果 `value` 发生改变，这个函数就会运行
          value: function () {
            let userId=JSON.parse(sessionStorage.getItem("user")).id; 
              if(userId!=null&&userId!=undefined){
                var year = this.dateFormat("YYYY", this.value);
                var month = this.dateFormat("mm", this.value);
                axios.get(this.url+'/controller/calendar/getOneMonthCalendar?userId='+userId+'&year='+year+'&month='+month)
                .then((response) => {
                  debugger;
                    if(response.errcode==0){
                      console.log("response=",response.data);
                      this.calendarData = response.data;
                    }
                })
              }else{
                this.$message({
                  message: '未获取到用户id！错误：用户信息不存在',
                  type: 'warning'
                });
              }
          }
      }
  }
</script>

<style>
.calendar-day{
      text-align: center;
      color: #202535;
      line-height: 30px;
      font-size: 12px;
  }
  .is-selected{
      color: #5ACF00;
      font-size: 10px;
      margin-top: 5px;
      text-align: center;
  }
  #calendar .el-button-group>.el-button:not(:first-child):not(:last-child):after{
      content: '当月';
  }
  /* .el-calendar-table td.is-selected{
    background-color: red!important;
  } */
</style>
