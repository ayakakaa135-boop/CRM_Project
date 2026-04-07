from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Attachment
from .serializers import AttachmentSerializer


class AttachmentListCreateView(generics.ListCreateAPIView):
    serializer_class   = AttachmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs  = Attachment.objects.select_related("content_type", "uploaded_by")
        ct  = self.request.query_params.get("content_type")
        oid = self.request.query_params.get("object_id")
        if ct and oid:
            from django.contrib.contenttypes.models import ContentType
            content_type = ContentType.objects.filter(model=ct.lower()).first()
            if content_type:
                qs = qs.filter(content_type=content_type, object_id=oid)
        return qs


class AttachmentDeleteView(generics.DestroyAPIView):
    queryset           = Attachment.objects.all()
    serializer_class   = AttachmentSerializer
    permission_classes = [IsAuthenticated]