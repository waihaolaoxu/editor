/*
    仿汽车之家发帖编辑器
    作者：前端老徐
    日期：2017-02-22
    依赖插件：jqueryui、jquery.mCustomScrollbar、jquery.emoji.js、layer.js、jquery.form
*/
function Editor() {
	//功能按钮配置
	this.btns = {
		text: '<span class="J_txtbtn"><i class="iconfont icon-qianbi"></i>文字</span>',
		pic: '<span class="J_uploadpic"><i class="iconfont icon-tupianbcc0119"></i>图片</span>',
		video: '<span class="J_video"> <i class="iconfont icon-shipin"></i>视频</span>',
		link: '<span class="J_link"> <i class="iconfont icon-link"></i>连接</span>',
		emoji: '<span class="J_emoji"> <i class="iconfont icon-biaoqing"></i>表情</span>',
		clear: '<span class="J_clear"> <i class="iconfont icon-del"></i>清空</span>'
	}

	// 默认配置
	this.config = {
		fn: ['text', 'pic', 'video', 'link', 'emoji', 'clear'],
		debugger: false,
		uploadUrl: ""
	}

	//功能模版
	this.templateInit = function(obj) {
		var _self = this;
		var htm = '<div class="Editor">\
                            <div class="editor_btns">\
                                <div class="J_function">' + (function() {
			var str = [];
			$.each(_self.config.fn, function(i, d) {
				str.push(_self.btns[d]);
			});
			return str.join('');
		}()) + '</div>\
                                <div class="J_tip tip">保存成功</div>\
                            </div>\
                            <div class="J_editor_body editor_body">\
                                <div class="J_text text" data-type="text">\
                                    <span class="J_del del"> <i class="iconfont icon-del1"></i>\
                                    </span>\
                                    <div class="J_drag drag">\
                                        <i class="iconfont icon-tuodong"></i> <em>上下拖拽修改排序</em>\
                                    </div>\
                                    <textarea placeholder="" spellcheck="false" class="form-control"></textarea>\
                                </div>\
                            </div>\
                        </div>';
		$(obj).html(htm);
		// 拖动排序
		$(".J_editor_body").sortable({
			axis: "y"
		});
		// 模块删除
		$(".J_editor_body").on('click', '.J_del', function() {
			if ($('.J_text').length > 1) {
				$(this).parents('.J_text').remove();
			} else {
				layer.msg('至少保留一个输入板块', {
					offset: '290px'
				});
			}
		});
	}

	this.template = function(opt) {
		var htm = '',
			_self = this;
		if (opt.type == "text" || opt.type == 'clear') {
			htm = '<div class="J_text text" data-type="text">\
                                <span class="J_del del"><i class="iconfont icon-del1"></i></span>\
                                <div class="J_drag drag"><i class="iconfont icon-tuodong"></i><em>上下拖拽修改排序</em></div>\
                                <textarea placeholder="" spellcheck="false" class="form-control">' + (opt.value ? opt.value : '') + '</textarea>\
                            </div>';
		} else if (opt.type == 'pic') {
			htm = '<div class="J_text text" data-type="pic">\
                                <span class="J_del del"><i class="iconfont icon-del1"></i></span>\
                                <div class="J_drag drag"><i class="iconfont icon-tuodong"></i><em>上下拖拽修改排序</em></div>\
                                <div class="pic_box">\
                                    <div class="pic" data-src="'+opt.url+'" style="background-image: url('+opt.url+')"></div>\
                                    <textarea placeholder="" spellcheck="false" class="form-control">' + (opt.value ? opt.value : '') + '</textarea>\
                                </div>\
                            </div>';
		} else if (opt.type == 'video') {
			htm = '<div class="J_text text" data-type="video">\
                                <span class="J_del del"><i class="iconfont icon-del1"></i></span>\
                                <div class="J_drag drag"><i class="iconfont icon-tuodong"></i><em>上下拖拽修改排序</em></div>\
                                <div class="pic_box">\
                                    <div class="video"><iframe src="' + opt.url + '" frameborder="0" width="100%" height="100%"></iframe></div>\
                                    <textarea placeholder="" spellcheck="false" class="form-control">' + (opt.value ? opt.value : '') + '</textarea>\
                                </div>\
                            </div>';
		}else if(opt.type == 'link'){
			htm= '<div class="J_text text" data-type="link">\
                                <span class="J_del del"> <i class="iconfont icon-del1"></i>\
                                </span>\
                                <div class="J_drag drag">\
                                    <i class="iconfont icon-tuodong"></i> <em>上下拖拽修改排序</em>\
                                </div>\
                                <div class="link">\
                                    <ul>'+(function(){
                                		var str=[];
                                    	if(opt.url){
                                    		$.each(opt.url,function(i,d){
                                    			str.push('<li><input type="text" name="title" placeholder="标题" value="'+d.title+'" class="form-control"/><input type="text" name="link" value="'+d.link+'" placeholder="连接URL" class="form-control"/><span class="J_delLink">删除</span></li>')
                                    		})
                                    	}else{
                                    		str.push('<li><input type="text" name="title" placeholder="标题" class="form-control"/><input type="text" name="link" placeholder="连接URL" class="form-control"/><span class="J_delLink">删除</span></li>');
                                    	}
                                    	return str.join('');
                                    }())+'</ul>\
                                	<button type="button" class="J_addLink btn btn-logo">添加</button>\
                                </div>\
                            </div>'
		}
		if (opt.type == 'clear') {
			$(".J_editor_body").html(htm).sortable("refresh");
		} else {
			$(".J_editor_body").append(htm).sortable("refresh");
		}
	}
}
Editor.prototype = {
	init: function(opt) {
		var _self = this;

		//debugger配置
		_self.config.debugger = opt && opt.debugger;


		// 传图url地址
		_self.config.uploadUrl = opt && opt.uploadUrl;

		//功能配置
		if (opt.fn) {
			_self.config.fn = opt.fn
		}


		// 初始化编辑器
		_self.templateInit(opt.box);
		if ('sessionStorage' in window) {
			if (sessionStorage.jStorage) {
				var data = JSON.parse(sessionStorage.jStorage);
				if (data.length) {
					$('.J_text').remove();
					$.each(data, function(i, d) {
						_self.template(d);
					});
				}
			}
		}


		_self.addText();
		_self.addPic();
		_self.addVideo();
		_self.addEmoji(opt.box);
		_self.addLink();
		_self.clear();
		_self.autoSave();

		// 打印配置
		_self.log(_self.config);
	},
	autoSave: function() {
		var _self = this;
		if ('sessionStorage' in window) {
			setInterval(function() {
				// layer.msg('20秒自动保存成功');
				$('.J_tip').fadeIn('400', function(e) {
					var d = this;
					setTimeout(function() {
						$(d).fadeOut('400');
					}, 1000)
				});
				sessionStorage.jStorage = JSON.stringify(_self.getData());
			}, 10000);
		}
	},
	log: function(t) {
		if (this.config.debugger) {
			console.log(t);
		}
	},
	addLink:function(){
		var _self = this;
		$('.J_link').click(function() {
			_self.template({
				type: 'link'
			});
		});
		$(".J_editor_body").on('click','.J_addLink',function(){
			$(this).prev('ul').append('<li><input type="text" name="title" placeholder="标题" class="form-control"/><input type="text" name="link" placeholder="连接URL" class="form-control"/><span class="J_delLink">删除</span></li>');
		});
		$(".J_editor_body").on('click','.J_delLink',function(){
			var $li=$(this).parent();
			if($li.siblings('li').length<=0){
				$(this).parents('.J_text').remove();
			}else{
				$li.remove();
			}
		});
	},
	addEmoji: function(obj) {
		//定位输入框
		$(obj).on('click', 'textarea', function() {
			$('.editor_focus').removeClass('editor_focus');
			$(this).addClass('editor_focus');
		});

		$(document).emoji({
			showTab: true,
			button: '.J_emoji',
			animation: 'fade',
			icons: [{
				name: "",
				path: "http://s.jiajuol.com/haopinjia/pc/0100/dist/lib/jquery-emoji/dist/img/qq/",
				maxNum: 91,
				excludeNums: [41, 45, 54],
				file: ".gif",
				placeholder: "[qq_{alias}]"
			}]
		});
	},
	addText: function() {
		var _self = this;
		$('.J_txtbtn').click(function() {
			_self.template({
				type: 'text'
			});
		})
	},
	addPic: function() {
		var _self = this;
		if (_self.config.uploadUrl == "") {
			alert('请配置上传图片接口地址');
			return;
		}
		$('.J_uploadpic').click(function() {
			var $this = $(this),
				$form = $('<form method="post" enctype="multipart/form-data"><input type="file" accept="image/gif,image/jpeg,image/jpg,image/png" name="file"></form>');
			if ($this.hasClass('disabled')) {
				return;
			}
			$form.find(':file').unbind('change').one('change', function(ev) {
				$this.addClass('disabled').html('<i class="iconfont icon-tupianbcc0119"></i>上传中...');
				var options = {
					url: _self.config.uploadUrl,
					dataType: "json",
					success: function(data) {
						if(data.code=='1000'){
							_self.template({
								type: 'pic',
								url: data.data.server+data.data.file_path
							});
						}else{
							layer.msg(data.msg, {
								icon: 2
							});
						}
						$this.removeClass('disabled').html('<i class="iconfont icon-tupianbcc0119"></i>上传图片');
					},
					error: function(e) {
						$this.removeClass('disabled').html('<i class="iconfont icon-tupianbcc0119"></i>上传图片');
						layer.msg('接口异常', {
							icon: 2
						});
					}
				}
				$form.ajaxSubmit(options);
			}).trigger('click');

		})
	},
	addVideo: function() {
		var _self = this;
		$('.J_video').click(function() {
			layer.prompt({
				formType: 2,
				title: '请输入视频URL',
				area: ['500px', '100px'] //自定义文本域宽高
			}, function(value, index, elem) {
				_self.template({
					type: 'video',
					url: value
				});
				layer.close(index);
			});
		})
	},
	clear: function() {
		var _self = this;
		$('.J_clear').click(function() {
			layer.confirm('确定要清空数据？', {
				btn: ['确定', '取消'] //按钮
			}, function(index) {
				_self.template({
					type: 'clear'
				});
				layer.close(index);
			}, function() {

			});
		})
	},
	getData: function() {
		var data = [];
		$('.J_text').each(function(i, d) {
			var $this = $(d);
			switch ($this.data('type')) {
				case 'text':
					data.push({
						type: 'text',
						value: $this.find('textarea').val()
					});
					break;
				case 'pic':
					data.push({
						type: 'pic',
						url: $this.find('.pic').data('src'),
						value: $this.find('textarea').val()
					});
					break;
				case 'video':
					data.push({
						type: 'video',
						url: $this.find('iframe').attr('src'),
						value: $this.find('textarea').val()
					});
					break;
				case 'link':
					var urls=[];
					$(this).find('li').each(function(i,d){
						var _title=$(d).find('[name=title]').val(),_link=$(d).find('[name=link]').val();
						if(_title&&_link){
							urls.push({
								title:_title,
								link:_link
							});
						}
					});
					if (urls.length) {
						data.push({
							type:'link',
							url:urls
						});
					}
				break;
			}
		});
		return data;
	}
}