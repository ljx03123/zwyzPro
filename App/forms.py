
from django import forms
from App.models import User

# 确认账号是否重复
class RegisterForm(forms.Form):
    mobile = forms.CharField(required=True, max_length=11, min_length=11,
                               error_messages={
                                   'reguired': '手机号码不能为空',
                                   'max_length': '手机号码长度有误',
                                   'min_length': '手机号码长度有误'
                               })
    # password = forms.CharField(required=True,
    #                            max_length=16,
    #                            min_length=6,
    #                            error_messages={
    #                                'required':'密码不能为空',
    #                                'max_length':'密码最多不超过16个字符',
    #                                'min_length':'密码最少不低于6个字符'
    #                            })
    # password2 = forms.CharField(required=True,
    #                            max_length=16,
    #                            min_length=6,
    #                            error_messages={
    #                                'required': '重复密码不能为空',
    #                                'max_length': '重复密码最多不超过16个字符',
    #                                'min_length': '重复密码最少不低于6个字符'
    #                            })

    def clean(self):
        telphone = self.cleaned_data.get('mobile')
        # password = self.cleaned_data.get('password')
        # password2 = self.cleaned_data.get('password2')
        if User.objects.filter(telphone=telphone).exists():
            raise forms.ValidationError({'telphone':'账户已存在'})
        # if password != password2:
        #     raise forms.ValidationError({'password':'两次密码不一致'})
        return self.cleaned_data
