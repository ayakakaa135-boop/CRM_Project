import factory
from factory.django import DjangoModelFactory
from faker import Faker
from django.utils import timezone

fake = Faker("ar_SA")


class UserFactory(DjangoModelFactory):
    class Meta:
        model = "accounts.User"

    username   = factory.Sequence(lambda n: f"user_{n}")
    email      = factory.LazyAttribute(lambda o: f"{o.username}@example.com")
    first_name = factory.Faker("first_name")
    last_name  = factory.Faker("last_name")
    role       = "employee"
    is_active  = True
    password   = factory.PostGenerationMethodCall("set_password", "testpass123")


class CompanyFactory(DjangoModelFactory):
    class Meta:
        model = "companies.Company"

    name      = factory.Sequence(lambda n: f"شركة اختبار {n}")
    cr_number = factory.Sequence(lambda n: f"10{n:09d}")
    email     = factory.Faker("email")
    phone     = factory.Faker("phone_number")
    status    = "active"


class ServiceTypeFactory(DjangoModelFactory):
    class Meta:
        model = "services.ServiceType"

    name      = factory.Sequence(lambda n: f"خدمة {n}")
    is_active = True


class ServiceReportFactory(DjangoModelFactory):
    class Meta:
        model = "reports.ServiceReport"

    company    = factory.SubFactory(CompanyFactory)
    created_by = factory.SubFactory(UserFactory, role="manager")
    date       = factory.LazyFunction(timezone.now().date)
    status     = "draft"


class ContractFactory(DjangoModelFactory):
    class Meta:
        model = "contracts.Contract"

    company    = factory.SubFactory(CompanyFactory)
    start_date = factory.LazyFunction(lambda: timezone.now().date())
    end_date   = factory.LazyFunction(
        lambda: (timezone.now() + timezone.timedelta(days=365)).date()
    )
    value  = factory.Faker("pydecimal", left_digits=6, right_digits=2, positive=True)
    status = "active"


class SubscriptionFactory(DjangoModelFactory):
    class Meta:
        model = "contracts.Subscription"

    company           = factory.SubFactory(CompanyFactory)
    contract          = factory.SubFactory(ContractFactory)
    service_type      = factory.SubFactory(ServiceTypeFactory)
    price             = factory.Faker("pydecimal", left_digits=4, right_digits=2, positive=True)
    billing_cycle     = "monthly"
    next_billing_date = factory.LazyFunction(
        lambda: (timezone.now() + timezone.timedelta(days=30)).date()
    )
    status = "active"


class ReceiptVoucherFactory(DjangoModelFactory):
    class Meta:
        model = "finance.ReceiptVoucher"

    company        = factory.SubFactory(CompanyFactory)
    amount         = factory.Faker("pydecimal", left_digits=5, right_digits=2, positive=True)
    date           = factory.LazyFunction(timezone.now().date)
    payment_method = "cash"
    created_by     = factory.SubFactory(UserFactory, role="manager")


class PaymentVoucherFactory(DjangoModelFactory):
    class Meta:
        model = "finance.PaymentVoucher"

    voucher_type   = "expense"
    amount         = factory.Faker("pydecimal", left_digits=5, right_digits=2, positive=True)
    date           = factory.LazyFunction(timezone.now().date)
    payment_method = "cash"
    created_by     = factory.SubFactory(UserFactory, role="admin")


class CommissionFactory(DjangoModelFactory):
    class Meta:
        model = "employees.Commission"

    employee = factory.SubFactory(UserFactory, role="employee")
    company  = factory.SubFactory(CompanyFactory)
    amount   = factory.Faker("pydecimal", left_digits=4, right_digits=2, positive=True)
    date     = factory.LazyFunction(timezone.now().date)
    status   = "pending"


class EmployeeRequestFactory(DjangoModelFactory):
    class Meta:
        model = "employees.EmployeeRequest"

    employee     = factory.SubFactory(UserFactory, role="employee")
    request_type = "leave"
    description  = factory.Faker("paragraph")
    status       = "pending"