from datetime import date, timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.companies.models import Company
from apps.contracts.models import Contract, Subscription
from apps.employees.models import Commission, EmployeeRequest
from apps.finance.models import PaymentVoucher, ReceiptVoucher
from apps.reports.models import ReportItem, ServiceReport
from apps.services.models import ServiceType


class Command(BaseCommand):
    help = "Create idempotent demo data for Docker browsing."

    def upsert_first(self, model, lookup, defaults):
        queryset = model.objects.filter(**lookup).order_by("pk")
        instance = queryset.first()

        if instance is None:
            return model.objects.create(**lookup, **defaults), True

        for field, value in defaults.items():
            setattr(instance, field, value)
        instance.save()
        return instance, False

    def ensure_user(self, username, password, defaults):
        User = get_user_model()
        user, _ = User.objects.get_or_create(username=username, defaults=defaults)
        for field, value in defaults.items():
            setattr(user, field, value)
        user.set_password(password)
        user.save()
        return user

    def handle(self, *args, **options):
        username = getattr(settings, "DEMO_ADMIN_USERNAME", "admin")
        password = getattr(settings, "DEMO_ADMIN_PASSWORD", "Admin123!pass")
        email = getattr(settings, "DEMO_ADMIN_EMAIL", "admin@example.com")

        User = get_user_model()

        admin_user = self.ensure_user(
            username,
            password,
            {
                "email": email,
                "first_name": "Demo",
                "last_name": "Admin",
                "role": User.Role.ADMIN,
                "is_staff": True,
                "is_superuser": True,
                "is_active": True,
            },
        )

        manager_user = self.ensure_user(
            "manager_demo",
            "Manager123!pass",
            {
                "email": "manager@example.com",
                "first_name": "Sara",
                "last_name": "Manager",
                "role": User.Role.MANAGER,
                "is_active": True,
            },
        )

        employee_user = self.ensure_user(
            "employee_demo",
            "Employee123!pass",
            {
                "email": "employee@example.com",
                "first_name": "Omar",
                "last_name": "Specialist",
                "role": User.Role.EMPLOYEE,
                "is_active": True,
            },
        )

        finance_user = self.ensure_user(
            "finance_demo",
            "Finance123!pass",
            {
                "email": "finance@example.com",
                "first_name": "Lina",
                "last_name": "Finance",
                "role": User.Role.MANAGER,
                "is_active": True,
            },
        )

        support_user = self.ensure_user(
            "support_demo",
            "Support123!pass",
            {
                "email": "support@example.com",
                "first_name": "Yousef",
                "last_name": "Support",
                "role": User.Role.EMPLOYEE,
                "is_active": True,
            },
        )

        companies_data = [
            {
                "cr_number": "DEMO-CR-001",
                "name": "Demo Holding",
                "email": "contact@demo-holding.test",
                "phone": "+966500000001",
                "address": "Riyadh",
                "status": Company.Status.ACTIVE,
                "notes": "Seeded company for Docker browsing.",
            },
            {
                "cr_number": "DEMO-CR-002",
                "name": "Vision Logistics",
                "email": "ops@vision-logistics.test",
                "phone": "+966500000002",
                "address": "Jeddah",
                "status": Company.Status.ACTIVE,
                "notes": "Demo logistics account.",
            },
            {
                "cr_number": "DEMO-CR-003",
                "name": "Atlas Retail",
                "email": "finance@atlas-retail.test",
                "phone": "+966500000003",
                "address": "Dammam",
                "status": Company.Status.ACTIVE,
                "notes": "Demo retail account.",
            },
            {
                "cr_number": "DEMO-CR-004",
                "name": "Mayan Logistics",
                "email": "operations@mayan-logistics.test",
                "phone": "+966500000004",
                "address": "Khobar",
                "status": Company.Status.ACTIVE,
                "notes": "Showcase client focused on logistics operations.",
            },
            {
                "cr_number": "DEMO-CR-005",
                "name": "Noor Education Systems",
                "email": "contact@noor-education.test",
                "phone": "+966500000005",
                "address": "Madinah",
                "status": Company.Status.ACTIVE,
                "notes": "Education and digital transformation account.",
            },
            {
                "cr_number": "DEMO-CR-006",
                "name": "Atlas Construction Group",
                "email": "bids@atlas-construction.test",
                "phone": "+966500000006",
                "address": "Riyadh",
                "status": Company.Status.ACTIVE,
                "notes": "Construction sector key account.",
            },
            {
                "cr_number": "DEMO-CR-007",
                "name": "Riyadh Medical Hub",
                "email": "admin@riyadh-medhub.test",
                "phone": "+966500000007",
                "address": "Riyadh",
                "status": Company.Status.ACTIVE,
                "notes": "Healthcare provider with recurring compliance work.",
            },
            {
                "cr_number": "DEMO-CR-008",
                "name": "Desert Bloom Events",
                "email": "projects@desert-bloom.test",
                "phone": "+966500000008",
                "address": "Jeddah",
                "status": Company.Status.ACTIVE,
                "notes": "Event management showcase account.",
            },
        ]

        companies = []
        for company_data in companies_data:
            company, _ = Company.objects.update_or_create(
                cr_number=company_data["cr_number"],
                defaults={k: v for k, v in company_data.items() if k != "cr_number"},
            )
            companies.append(company)

        service_types_data = [
            {
                "name": "Commercial Registration Renewal",
                "description": "Renewal workflow for CR records.",
            },
            {
                "name": "Municipality License",
                "description": "Municipality permit and license processing.",
            },
            {
                "name": "Chamber Certificate",
                "description": "Chamber of commerce subscription services.",
            },
            {
                "name": "Labor Office File Update",
                "description": "Labor office and HR file maintenance.",
            },
            {
                "name": "Vendor Registration",
                "description": "Vendor onboarding and procurement registration.",
            },
            {
                "name": "Health License Coordination",
                "description": "Healthcare-related licensing and renewals.",
            },
        ]

        service_types = []
        for service_type_data in service_types_data:
            service_type, _ = ServiceType.objects.update_or_create(
                name=service_type_data["name"],
                defaults={
                    "description": service_type_data["description"],
                    "is_active": True,
                },
            )
            service_types.append(service_type)

        seeded_reports = []
        company_contacts = [manager_user, employee_user, finance_user, support_user]
        for index, company in enumerate(companies, start=1):
            service_type = service_types[(index - 1) % len(service_types)]
            contract_owner = company_contacts[(index - 1) % len(company_contacts)]
            contract, _ = self.upsert_first(
                Contract,
                {
                    "company": company,
                    "notes": f"Seeded annual contract {index}.",
                },
                {
                    "start_date": date.today() - timedelta(days=30 * index),
                    "end_date": date.today() + timedelta(days=365 - (index * 20)),
                    "value": 25000 + (index * 12000),
                    "status": Contract.Status.ACTIVE if index <= 6 else Contract.Status.PENDING,
                },
            )

            subscription, _ = self.upsert_first(
                Subscription,
                {
                    "company": company,
                    "service_type": service_type,
                },
                {
                    "contract": contract,
                    "price": 1500 + (index * 700),
                    "billing_cycle": Subscription.BillingCycle.MONTHLY if index in {1, 4, 7} else Subscription.BillingCycle.YEARLY,
                    "next_billing_date": date.today() + timedelta(days=10 * index),
                    "status": Subscription.Status.ACTIVE,
                },
            )

            _, _ = self.upsert_first(
                ReceiptVoucher,
                {
                    "company": company,
                    "reference": f"DEMO-RV-00{index}",
                },
                {
                    "subscription": subscription,
                    "amount": 1500 + (index * 700),
                    "date": date.today() - timedelta(days=index),
                    "payment_method": (
                        ReceiptVoucher.PaymentMethod.BANK_TRANSFER
                        if index % 3 != 0
                        else ReceiptVoucher.PaymentMethod.CHEQUE
                    ),
                    "notes": f"Seeded receipt voucher {index}.",
                    "created_by": admin_user,
                },
            )

            payment, _ = self.upsert_first(
                PaymentVoucher,
                {
                    "reference": f"DEMO-PV-00{index}",
                },
                {
                    "voucher_type": (
                        PaymentVoucher.VoucherType.COMMISSION
                        if index in {1, 2, 5}
                        else PaymentVoucher.VoucherType.EXPENSE
                    ),
                    "employee": contract_owner,
                    "amount": 500 + (index * 250),
                    "date": date.today() - timedelta(days=index),
                    "payment_method": (
                        PaymentVoucher.PaymentMethod.BANK_TRANSFER
                        if index % 2 == 0
                        else PaymentVoucher.PaymentMethod.CASH
                    ),
                    "notes": f"Seeded payment voucher {index}.",
                    "created_by": admin_user,
                },
            )

            _, _ = self.upsert_first(
                Commission,
                {
                    "employee": contract_owner,
                    "company": company,
                    "notes": f"Seeded commission for employee pages {index}.",
                },
                {
                    "amount": 500 + (index * 250),
                    "date": date.today() - timedelta(days=index),
                    "status": Commission.Status.PAID if index in {1, 4, 6} else Commission.Status.PENDING,
                    "payment_voucher": payment if index == 1 else None,
                },
            )

            report, _ = self.upsert_first(
                ServiceReport,
                {
                    "company": company,
                    "created_by": admin_user,
                    "notes": f"Seeded public report for browser verification {index}.",
                },
                {
                    "date": date.today() - timedelta(days=index),
                    "status": ServiceReport.Status.PUBLISHED,
                    "is_shared": True,
                },
            )
            seeded_reports.append(report)

            _, _ = self.upsert_first(
                ReportItem,
                {
                    "report": report,
                    "service_type": service_type,
                },
                {
                    "description": f"{service_type.name} completed for {company.name}.",
                    "notes": f"Demo report line item {index}.",
                },
            )

        request_specs = [
            (manager_user, EmployeeRequest.RequestType.LEAVE, "Seeded annual leave request.", EmployeeRequest.Status.APPROVED),
            (employee_user, EmployeeRequest.RequestType.ADVANCE, "Seeded salary advance request.", EmployeeRequest.Status.PENDING),
            (employee_user, EmployeeRequest.RequestType.OVERTIME, "Seeded overtime request.", EmployeeRequest.Status.REJECTED),
            (finance_user, EmployeeRequest.RequestType.OTHER, "Seeded finance system support complaint.", EmployeeRequest.Status.APPROVED),
            (support_user, EmployeeRequest.RequestType.LEAVE, "Seeded support team leave request.", EmployeeRequest.Status.PENDING),
        ]

        for employee, request_type, description, status in request_specs:
            _, _ = self.upsert_first(
                EmployeeRequest,
                {
                    "employee": employee,
                    "description": description,
                },
                {
                    "request_type": request_type,
                    "status": status,
                    "reviewed_by": admin_user if status != EmployeeRequest.Status.PENDING else None,
                    "reviewed_at": timezone.now() if status != EmployeeRequest.Status.PENDING else None,
                },
            )

        self.stdout.write(self.style.SUCCESS(f"Demo admin ready: {username} / {password}"))
        self.stdout.write(self.style.SUCCESS(f"Demo share token: {seeded_reports[0].share_token}"))
