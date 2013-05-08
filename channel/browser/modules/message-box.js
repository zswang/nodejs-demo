/**
 * @author 王集鹄(wangjihu，http://weibo.com/zswang)
 */
AceCore.addModule("MessageBox", function(sandbox){
    /**
     * 事件集合
     */
    var events = sandbox.getConfig("Events");
    /**
     * 类库
     */
    var lib = sandbox.getLib();
    /**
     * 消息列表
     */
    var messageTree;
    /**
     * 登录信息
     */
    var passportInfo = {};
    /**
     * 获取房间当前状态成功
     * @param {Object} data
     */
    function pickSuccess(data) {
        lib.each(data, function(item) {
            switch(item.type) {
                case "passport":
                    passportInfo = item.info;
                    break;
                case "messageAll":
                    messageTree.loadChilds(item.messages);
                    scrollBottom();
                    break;
                case "messageAdd":
                    messageTree.appendChilds(item.messages);
                    scrollBottom();
                    break;
            }
        });
    }
    /**
     * 滚动到底部
     */
    function scrollBottom() {
        var parent = messageTree.parent.parentNode;
        parent.scrollTop = parent.scrollHeight;
    }
    
    /**
     * 格式化时间
     * @param {Date} time
     */
    function formatTime(time) {
        time = new Date(time);
        var timeStr = lib.date.format(time, "HH:mm:ss");
        var dateStr = lib.date.format(time, "yyyy-MM-dd");
        return lib.date.format(new Date, "yyyy-MM-dd") == dateStr ? timeStr :
            [dateStr, timeStr].join(" ");
    }

    /**
     * 处理多行文本
     * @param {String} text 文本
     */
    function mutiline(text) {
        return lib.encodeHTML(text).replace(/\n/g, "<br/>");
    }
    
    return {
        init: function() {

        AceUbb.addPlugin('color', function(text){
            return String(text).replace(/\[(red|orange|yellow|green|blue|indigo|violet|beige|black|brown|gray|navy|silver|tan)\]([\s\S]*?)\[\/\1\]/g, function(all, color, text){
                return '<span style="color:' + color + ';">' + text + '</span>';
            });
        });

        AceUbb.addPlugin('weibo', function(text){
            var dict = {
'[bm做操]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/09/bmzuocao_thumb.gif',
'[bm抓狂]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/60/bmzhuakuang_thumb.gif',
'[bm中枪]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ff/bmzhongqiang_thumb.gif',
'[bm震惊]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/63/bmzhenjing_thumb.gif',
'[bm赞]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c9/bmzan_thumb.gif',
'[bm喜悦]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/47/bmxiyue_thumb.gif',
'[bm醒悟]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8f/bmxingwu_thumb.gif',
'[bm兴奋]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a7/bmxingfen_thumb.gif',
'[bm血泪]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0d/bmxielei_thumb.gif',
'[bm挖鼻孔]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/bd/bmwabikong_thumb.gif',
'[bm吐舌头]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8f/bmtushetou_thumb.gif',
'[bm吐槽]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/73/bmtucao_thumb.gif',
'[bm投诉]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/04/bmtousu_thumb.gif',
'[bm跳绳]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/2a/bmtiaosheng_thumb.gif',
'[bm调皮]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/da/bmtiaopi_thumb.gif',
'[bm讨论]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/20/bmtaolun_thumb.gif',
'[bm抬腿]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/86/bmtaitui_thumb.gif',
'[bm思考]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0f/bmsikao_thumb.gif',
'[bm生气]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8f/bmshengqi_thumb.gif',
'[bm亲吻]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a4/bmqinwen_thumb.gif',
'[bm庆幸]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6c/bmqingxing_thumb.gif',
'[bm内涵]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/66/bmneihan_thumb.gif',
'[bm忙碌]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/18/bmmanglu_thumb.gif',
'[bm乱入]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a9/bmluanru_thumb.gif',
'[bm卖萌]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ba/bmluanmeng_thumb.gif',
'[bm流泪]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d6/bmliulei_thumb.gif',
'[bm流口水]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a4/bmliukoushui_thumb.gif',
'[bm流鼻涕]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4f/bmliubiti_thumb.gif',
'[bm路过]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/75/bmliguo_thumb.gif',
'[bm咧嘴]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3e/bmliezui_thumb.gif',
'[bm啦啦队]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4e/bmlaladui_thumb.gif',
'[bm哭诉]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9b/bmkusu_thumb.gif',
'[bm哭泣]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a8/bmkuqi_thumb.gif',
'[bm苦逼]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/dc/bmkubi_thumb.gif',
'[bm口哨]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0c/bmkoushao_thumb.gif',
'[bm可爱]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/95/bmkeai_thumb.gif',
'[bm紧张]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4c/bmjinzhang_thumb.gif',
'[bm惊讶]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/03/bmjingya_thumb.gif',
'[bm惊吓]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/be/bmjingxia_thumb.gif',
'[bm焦虑]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4e/bmjiaolv_thumb.gif',
'[bm会心笑]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7e/bmhuixinxiao_thumb.gif',
'[bm坏笑]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ec/bmhuaixiao_thumb.gif',
'[bm花痴]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4b/bmhuachi_thumb.gif',
'[bm厚脸皮]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/61/bmhoulianpi_thumb.gif',
'[bm好吧]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/16/bmhaoba_thumb.gif',
'[bm害怕]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6c/bmhaipa_thumb.gif',
'[bm鬼脸]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/15/bmguilian_thumb.gif',
'[bm孤独]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e4/bmgudu_thumb.gif',
'[bm高兴]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/85/bmgaoxing_thumb.gif',
'[bm搞怪]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4b/bmgaoguai_thumb.gif',
'[bm干笑]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b4/bmganxiao_thumb.gif',
'[bm感动]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/34/bmgandong_thumb.gif',
'[bm愤懑]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fc/bmfenmen_thumb.gif',
'[bm反对]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b6/bmfandui_thumb.gif',
'[bm踱步]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/54/bmduobu_thumb.gif',
'[bm顶]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/34/bmding_thumb.gif',
'[bm得意]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7a/bmdeyi_thumb.gif',
'[bm得瑟]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7d/bmdese_thumb.gif',
'[bm大笑]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/37/bmdaxiao_thumb.gif',
'[bm蛋糕]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f8/bmdangao_thumb.gif',
'[bm大哭]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/dc/bmdaku_thumb.gif',
'[bm大叫]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/83/bmdajiao_thumb.gif',
'[bm吃惊]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b0/bmchijing_thumb.gif',
'[bm馋]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d9/bmchan_thumb.gif',
'[bm彩色]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7e/bmcaise_thumb.gif',
'[bm缤纷]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/15/bmbinfen_thumb.gif',
'[bm变身]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b7/bmbianshen_thumb.gif',
'[bm悲催]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/77/bmbeicui_thumb.gif',
'[bm暴怒]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/12/bmbaonu_thumb.gif',
'[bm熬夜]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a4/bmaoye_thumb.gif',
'[bm暗爽]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/bc/bmanshuang_thumb.gif',
'[月儿圆]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3d/lxhyueeryuan_thumb.gif',
'[招财]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a9/lxhzhaocai_thumb.gif',
'[微博三岁啦]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1e/lxhweibo3yr_thumb.gif',
'[复活节]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d6/lxhfuhuojie_thumb.gif',
'[挤火车]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/09/lxhjihuoche_thumb.gif',
'[愚人节]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/21/lxhyurenjie_thumb.gif',
'[收藏]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/83/lxhshoucang_thumb.gif',
'[喜得金牌]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a2/lxhhappygold_thumb.gif',
'[夺冠感动]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/69/lxhduoguan_thumb.gif',
'[冠军诞生]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/2c/lxhguanjun_thumb.gif',
'[传火炬]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f2/lxhchuanhuoju_thumb.gif',
'[奥运金牌]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/06/lxhgold_thumb.gif',
'[奥运银牌]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/43/lxhbronze_thumb.gif',
'[奥运铜牌]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fd/lxhsilver_thumb.gif',
'[德国队加油]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/12/germany_thumb.gif',
'[西班牙队加油]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/be/spain_thumb.gif',
'[葡萄牙队加油]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f8/portugal_thumb.gif',
'[意大利队加油]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/03/italy_thumb.gif',
'[耍花灯]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/be/lxhshuahuadeng_thumb.gif',
'[元宵快乐]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/83/lxhyuanxiaohappy_thumb.gif',
'[吃汤圆]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/52/lxhchitangyuan_thumb.gif',
'[金元宝]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9b/lxhjinyuanbao_thumb.gif',
'[红包拿来]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/bd/lxhhongbaonalai_thumb.gif',
'[福到啦]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f4/lxhfudaola_thumb.gif',
'[放鞭炮]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/bd/lxhbianpao_thumb.gif',
'[发红包]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/27/lxhhongbao_thumb.gif',
'[大红灯笼]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/90/lxhdahongdenglong_thumb.gif',
'[拜年了]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0c/lxhbainianle_thumb.gif',
'[龙啸]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/cd/lxhlongxiao_thumb.gif',
'[光棍节]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/5b/lxh1111_thumb.gif',
'[蛇年快乐]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/5f/lxhshenian_thumb.gif',
'[过年啦]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/94/lxhguonianla_thumb.gif',
'[圆蛋快乐]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/eb/lxhyuandan_thumb.gif',
'[发礼物]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/24/lxh_santa_thumb.gif',
'[要礼物]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d2/lxh_gift_thumb.gif',
'[平安果]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0f/lxh_apple_thumb.gif',
'[吓到了]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fa/lxhscare_thumb.gif',
'[走你]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ed/zouni_thumb.gif',
'[吐血]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8c/lxhtuxue_thumb.gif',
'[好激动]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ae/lxhjidong_thumb.gif',
'[没人疼]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/23/lxhlonely_thumb.gif',
'[转发]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/02/lxhzhuanfa_thumb.gif',
'[笑哈哈]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/32/lxhwahaha_thumb.gif',
'[得意地笑]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d4/lxhdeyidixiao_thumb.gif',
'[噢耶]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3b/lxhxixi_thumb.gif',
'[偷乐]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/fa/lxhtouxiao_thumb.gif',
'[泪流满面]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/64/lxhtongku_thumb.gif',
'[巨汗]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f6/lxhjuhan_thumb.gif',
'[抠鼻屎]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/48/lxhkoubishi_thumb.gif',
'[求关注]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ac/lxhqiuguanzhu_thumb.gif',
'[真V5]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3a/lxhv5_thumb.gif',
'[群体围观]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a8/lxhweiguan_thumb.gif',
'[hold住]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/05/lxhholdzhu_thumb.gif',
'[羞嗒嗒]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/df/lxhxiudada_thumb.gif',
'[非常汗]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/42/lxhpubuhan_thumb.gif',
'[许愿]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/87/lxhxuyuan_thumb.gif',
'[崩溃]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c7/lxhzhuakuang_thumb.gif',
'[好囧]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/96/lxhhaojiong_thumb.gif',
'[震惊]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e7/lxhchijing_thumb.gif',
'[别烦我]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/22/lxhbiefanwo_thumb.gif',
'[不好意思]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b4/lxhbuhaoyisi_thumb.gif',
'[纠结]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1f/lxhjiujie_thumb.gif',
'[拍手]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e3/lxhguzhang_thumb.gif',
'[给劲]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a5/lxhgeili_thumb.gif',
'[好喜欢]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d6/lxhlike_thumb.gif',
'[好爱哦]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/74/lxhainio_thumb.gif',
'[路过这儿]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ac/lxhluguo_thumb.gif',
'[悲催]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/43/lxhbeicui_thumb.gif',
'[不想上班]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6b/lxhbuxiangshangban_thumb.gif',
'[躁狂症]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ca/lxhzaokuangzheng_thumb.gif',
'[甩甩手]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a6/lxhshuaishuaishou_thumb.gif',
'[瞧瞧]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8b/lxhqiaoqiao_thumb.gif',
'[同意]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/14/lxhtongyi_thumb.gif',
'[喝多了]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a7/lxhheduole_thumb.gif',
'[啦啦啦啦]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3d/lxhlalalala_thumb.gif',
'[杰克逊]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e5/lxhjiekexun_thumb.gif',
'[雷锋]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7a/lxhleifeng_thumb.gif',
'[带感]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d2/lxhdaigan_thumb.gif',
'[亲一口]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/88/lxhqinyikou_thumb.gif',
'[飞个吻]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8a/lxhblowakiss_thumb.gif',
'[加油啊]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/03/lxhjiayou_thumb.gif',
'[七夕]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9a/lxhqixi_thumb.gif',
'[困死了]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/00/lxhkunsile_thumb.gif',
'[有鸭梨]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7e/lxhyouyali_thumb.gif',
'[右边亮了]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ae/lxhliangle_thumb.gif',
'[撒花]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b3/lxhfangjiala_thumb.gif',
'[好棒]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3e/lxhhaobang_thumb.gif',
'[想一想]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e9/lxhxiangyixiang_thumb.gif',
'[下班]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f2/lxhxiaban_thumb.gif',
'[最右]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c8/lxhzuiyou_thumb.gif',
'[丘比特]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/35/lxhqiubite_thumb.gif',
'[中箭]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/81/lxhzhongjian_thumb.gif',
'[互相膜拜]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3c/lxhhuxiangmobai_thumb.gif',
'[膜拜了]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/52/lxhmobai_thumb.gif',
'[放电抛媚]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d0/lxhfangdianpaomei_thumb.gif',
'[霹雳]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/41/lxhshandian_thumb.gif',
'[被电]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ed/lxhbeidian_thumb.gif',
'[拍砖]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3b/lxhpaizhuan_thumb.gif',
'[互相拍砖]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/5b/lxhhuxiangpaizhuan_thumb.gif',
'[采访]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8b/lxhcaifang_thumb.gif',
'[发表言论]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f1/lxhfabiaoyanlun_thumb.gif',
'[江南style]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/67/gangnamstyle_thumb.gif',
'[牛]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/24/lxhniu_thumb.gif',
'[玫瑰]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f6/lxhrose_thumb.gif',
'[赞啊]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/00/lxhzan_thumb.gif',
'[推荐]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e9/lxhtuijian_thumb.gif',
'[放假啦]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/37/lxhfangjiale_thumb.gif',
'[萌翻]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/99/lxhmengfan_thumb.gif',
'[吃货]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ba/lxhgreedy_thumb.gif',
'[大南瓜]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/4d/lxhpumpkin_thumb.gif',
'[赶火车]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a2/lxhganhuoche_thumb.gif',
'[立志青年]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f9/lxhlizhiqingnian_thumb.gif',
'[得瑟]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ca/lxhdese_thumb.gif',
'[草泥马]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7a/shenshou_thumb.gif',
'[神马]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/60/horse2_thumb.gif',
'[浮云]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/bc/fuyun_thumb.gif',
'[给力]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c9/geili_thumb.gif',
'[围观]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f2/wg_thumb.gif',
'[威武]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/70/vw_thumb.gif',
'[熊猫]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6e/panda_thumb.gif',
'[兔子]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/81/rabbit_thumb.gif',
'[奥特曼]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/bc/otm_thumb.gif',
'[囧]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/15/j_thumb.gif',
'[互粉]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/89/hufen_thumb.gif',
'[礼物]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c4/liwu_thumb.gif',
'[呵呵]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ac/smilea_thumb.gif',
'[嘻嘻]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0b/tootha_thumb.gif',
'[哈哈]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6a/laugh.gif',
'[可爱]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/14/tza_thumb.gif',
'[可怜]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/af/kl_thumb.gif',
'[挖鼻屎]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a0/kbsa_thumb.gif',
'[吃惊]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f4/cj_thumb.gif',
'[害羞]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6e/shamea_thumb.gif',
'[挤眼]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c3/zy_thumb.gif',
'[闭嘴]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/29/bz_thumb.gif',
'[鄙视]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/71/bs2_thumb.gif',
'[爱你]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6d/lovea_thumb.gif',
'[泪]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9d/sada_thumb.gif',
'[偷笑]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/19/heia_thumb.gif',
'[亲亲]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8f/qq_thumb.gif',
'[生病]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b6/sb_thumb.gif',
'[太开心]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/58/mb_thumb.gif',
'[懒得理你]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/17/ldln_thumb.gif',
'[右哼哼]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/98/yhh_thumb.gif',
'[左哼哼]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6d/zhh_thumb.gif',
'[嘘]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a6/x_thumb.gif',
'[衰]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/af/cry.gif',
'[委屈]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/73/wq_thumb.gif',
'[吐]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9e/t_thumb.gif',
'[打哈欠]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f3/k_thumb.gif',
'[抱抱]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/27/bba_thumb.gif',
'[怒]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7c/angrya_thumb.gif',
'[疑问]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/5c/yw_thumb.gif',
'[馋嘴]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a5/cza_thumb.gif',
'[拜拜]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/70/88_thumb.gif',
'[思考]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e9/sk_thumb.gif',
'[汗]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/24/sweata_thumb.gif',
'[困]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7f/sleepya_thumb.gif',
'[睡觉]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6b/sleepa_thumb.gif',
'[钱]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/90/money_thumb.gif',
'[失望]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0c/sw_thumb.gif',
'[酷]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/cool_thumb.gif',
'[花心]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8c/hsa_thumb.gif',
'[哼]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/49/hatea_thumb.gif',
'[鼓掌]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/36/gza_thumb.gif',
'[晕]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d9/dizzya_thumb.gif',
'[悲伤]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1a/bs_thumb.gif',
'[抓狂]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/62/crazya_thumb.gif',
'[黑线]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/91/h_thumb.gif',
'[阴险]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6d/yx_thumb.gif',
'[怒骂]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/89/nm_thumb.gif',
'[心]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/hearta_thumb.gif',
'[伤心]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ea/unheart.gif',
'[猪头]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/58/pig.gif',
'[ok]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d6/ok_thumb.gif',
'[耶]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d9/ye_thumb.gif',
'[good]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d8/good_thumb.gif',
'[不要]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c7/no_thumb.gif',
'[赞]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d0/z2_thumb.gif',
'[来]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/come_thumb.gif',
'[弱]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d8/sad_thumb.gif',
'[蜡烛]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/91/lazu_thumb.gif',
'[钟]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d3/clock_thumb.gif',
'[话筒]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1b/m_thumb.gif',
'[蛋糕]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6a/cake.gif',
'[挤眼]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c3/zy_thumb.gif',
'[亲亲]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8f/qq_thumb.gif',
'[怒骂]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/89/nm_thumb.gif',
'[太开心]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/58/mb_thumb.gif',
'[懒得理你]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/17/ldln_thumb.gif',
'[打哈欠]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f3/k_thumb.gif',
'[生病]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/b6/sb_thumb.gif',
'[书呆子]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/61/sdz_thumb.gif',
'[失望]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0c/sw_thumb.gif',
'[可怜]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/af/kl_thumb.gif',
'[黑线]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/91/h_thumb.gif',
'[吐]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9e/t_thumb.gif',
'[委屈]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/73/wq_thumb.gif',
'[思考]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/e9/sk_thumb.gif',
'[哈哈]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6a/laugh.gif',
'[嘘]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a6/x_thumb.gif',
'[右哼哼]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/98/yhh_thumb.gif',
'[左哼哼]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6d/zhh_thumb.gif',
'[疑问]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/5c/yw_thumb.gif',
'[阴险]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6d/yx_thumb.gif',
'[顶]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/91/d_thumb.gif',
'[钱]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/90/money_thumb.gif',
'[悲伤]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/1a/bs_thumb.gif',
'[鄙视]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/71/bs2_thumb.gif',
'[拜拜]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/70/88_thumb.gif',
'[吃惊]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f4/cj_thumb.gif',
'[闭嘴]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/29/bz_thumb.gif',
'[衰]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/af/cry.gif',
'[愤怒]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/bd/fn_thumb.gif',
'[感冒]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a0/gm_thumb.gif',
'[酷]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/cool_thumb.gif',
'[来]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/come_thumb.gif',
'[good]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d8/good_thumb.gif',
'[haha]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/13/ha_thumb.gif',
'[不要]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c7/no_thumb.gif',
'[ok]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d6/ok_thumb.gif',
'[拳头]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/cc/o_thumb.gif',
'[弱]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d8/sad_thumb.gif',
'[握手]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0c/ws_thumb.gif',
'[赞]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d0/z2_thumb.gif',
'[耶]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d9/ye_thumb.gif',
'[最差]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/3e/bad_thumb.gif',
'[打哈气]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/f3/k_thumb.gif',
'[可爱]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/14/tza_thumb.gif',
'[嘻嘻]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0b/tootha_thumb.gif',
'[汗]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/24/sweata_thumb.gif',
'[呵呵]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/ac/smilea_thumb.gif',
'[困]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7f/sleepya_thumb.gif',
'[睡觉]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6b/sleepa_thumb.gif',
'[害羞]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6e/shamea_thumb.gif',
'[泪]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9d/sada_thumb.gif',
'[爱你]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/6d/lovea_thumb.gif',
'[挖鼻屎]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a0/kbsa_thumb.gif',
'[花心]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/8c/hsa_thumb.gif',
'[偷笑]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/19/heia_thumb.gif',
'[心]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/hearta_thumb.gif',
'[哼]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/49/hatea_thumb.gif',
'[鼓掌]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/36/gza_thumb.gif',
'[晕]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/d9/dizzya_thumb.gif',
'[馋嘴]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a5/cza_thumb.gif',
'[抓狂]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/62/crazya_thumb.gif',
'[抱抱]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/27/bba_thumb.gif',
'[怒]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7c/angrya_thumb.gif',
'[右抱抱]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/0d/right_thumb.gif',
'[左抱抱]': 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/54/left_thumb.gif'};
                return String(text).replace(/\[([^\]]*)\]/g, function(all){
                    
                    return dict[all] ? '<img src="' + dict[all] + '" alt="' + all + '">' : all;
                });
            });
            messageTree = AceTree.create({
                parent: lib.g("messageListTemplate").parentNode,
                oninit: function(tree){
                    tree.eventHandler = AceEvent.on(tree.parent, function(command, element, e){
                        var node = tree.node4target(element);
                        node && tree.oncommand(command, node, e);
                    });
                },
                onreader: function(node){
                    return AceTemplate.format('messageListTemplate', node.data, {
                        node: node,
                        formatTime: formatTime,
                        mutiline: mutiline,
                        markdown: function(text){
                            return markdown.toHTML(text);
                        },
                        ubb: function(text){
                            return AceUbb.exportHtml(text);
                        }
                    });
                },
                oncommand: function(command, node, e){
                    switch (command) {
                        case "letter":
                            sandbox.fire(events.letterDialog, {
                                nick: node.data.nick,
                                to: node.data.from
                            });
                            break;
                    }
                },
                statusClasses: /^(focus|hover|select|expand|self)$/,
                oncreated: function(node) {
                    node.setStatus("self", node.data.from == passportInfo.id, true);
                }
            });
            
            sandbox.on(events.pickSuccess, pickSuccess);
        }
    };
});