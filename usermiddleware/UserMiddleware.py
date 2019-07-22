from django.http import JsonResponse
from django.shortcuts import redirect, reverse, render
from django.utils.deprecation import MiddlewareMixin
from App.models import User


class UserLoginMiddleware(MiddlewareMixin):
    def process_request(self, request):
        path_list1 = ['/zwyzPro/addcar/',
                      '/zwyzPro/goodcar/',    # 需要渲染html
                      '/zwyzPro/order/']
        path_list2 = ['/zwyzPro/goodsnum/',
                      '/zwyzPro/totalgoodsprice/',
                      '/zwyzPro/reducegoods/',
                      '/zwyzPro/addgoods/',
                      '/zwyzPro/selectgoods/',
                      '/zwyzPro/delgoods/',
                      '/zwyzPro/delallgoods/',
                      '/zwyzPro/delfalsegoods/',
                      '/zwyzPro/list/',
                      '/zwyzPro/entryorder/',
                      '/zwyzPro/detail/'
                      ]    # 返回JsonResponse
        data = {
            'status': 1,
            'msg': 'ok'
        }
        if request.path in path_list1 + path_list2 :
            user_id = request.session.get('user_id')
            if not user_id:
                if request.path in path_list1 :
                    data['msg'] = '请先登录'
                    data['status'] = 2
                    return redirect(reverse('App:login'))
                else:
                    data['status'] = -1
                    data['msg'] = '请先登录后操作'
                    return JsonResponse(data)
            else:
                try:
                    user = User.objects.get(id=user_id)
                    request.user = user
                except:
                    if request.path in path_list1:
                        return redirect(reverse('App:login'))
                    else:
                        data['status'] = -2
                        data['msg'] = '用户不存在'
                        return JsonResponse(data)
