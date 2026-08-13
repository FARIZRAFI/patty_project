from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models import (
    User, UserRole, CustomerAddress,
    Branch, BranchUser,
    Category, Product, ProductModifier, Inventory,
    Order, OrderItem, OrderStatusHistory, OrderStatus, OrderType, PaymentStatus,
    LoyaltyAccount, LoyaltyTransaction, LoyaltyReward,
    Coupon, Printer
)

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if database is already seeded
    if db.query(User).filter(User.email == "admin@pattyproject.co.uk").first():
        print("Database already seeded.")
        db.close()
        return

    print("Seeding database with Patty Project UK production data...")

    # 1. Create Super Admin User
    admin = User(
        email="admin@pattyproject.co.uk",
        password_hash=get_password_hash("Admin123!"),
        full_name="Super Admin",
        phone="+44 20 7946 0912",
        role=UserRole.SUPER_ADMIN,
        is_active=True
    )
    db.add(admin)

    # 2. Create Branch Admins
    central_admin = User(
        email="central@pattyproject.co.uk",
        password_hash=get_password_hash("Central123!"),
        full_name="London Central Admin",
        phone="+44 7700 900111",
        role=UserRole.BRANCH_ADMIN,
        is_active=True
    )
    westfield_admin = User(
        email="westfield@pattyproject.co.uk",
        password_hash=get_password_hash("Westfield123!"),
        full_name="London Westfield Admin",
        phone="+44 7700 900222",
        role=UserRole.BRANCH_ADMIN,
        is_active=True
    )
    db.add_all([central_admin, westfield_admin])

    # 3. Create Sample Customer User
    customer = User(
        email="john.smith@email.com",
        password_hash=get_password_hash("Customer123!"),
        full_name="John Smith",
        phone="+44 7123 456789",
        role=UserRole.CUSTOMER,
        is_active=True
    )
    db.add(customer)
    db.flush()

    # Customer Address
    address = CustomerAddress(
        user_id=customer.id,
        label="Home",
        address_line1="123 Baker Street",
        address_line2="Near Baker Street Station",
        city="London",
        postcode="W1U 6EP",
        phone="+44 7123 456789",
        is_default=True
    )
    db.add(address)

    # Loyalty Account for Customer
    loyalty_acc = LoyaltyAccount(
        user_id=customer.id,
        available_points=1250,
        lifetime_points=2450,
        tier="SILVER"
    )
    db.add(loyalty_acc)

    # 4. Create Initial UK Branches
    branch_central = Branch(
        code="LC",
        name="London - Central",
        address_line1="45 Camden High Street",
        postcode="NW1 7JE",
        city="London",
        latitude=51.5360,
        longitude=-0.1420,
        phone="+44 20 7417 5211",
        delivery_enabled=True,
        collection_enabled=True,
        ordering_enabled=True,
        delivery_radius_miles=2.0,
        opening_hours={"monday": {"open": "10:00", "close": "23:00"}, "tuesday": {"open": "10:00", "close": "23:00"}, "wednesday": {"open": "10:00", "close": "23:00"}, "thursday": {"open": "10:00", "close": "23:00"}, "friday": {"open": "10:00", "close": "00:00"}, "saturday": {"open": "10:00", "close": "00:00"}, "sunday": {"open": "10:00", "close": "22:00"}},
        is_active=True
    )
    branch_westfield = Branch(
        code="LW",
        name="London - Westfield",
        address_line1="Ariel Way, Shepherd's Bush",
        postcode="W12 7GF",
        city="London",
        latitude=51.5074,
        longitude=-0.2217,
        phone="+44 20 8749 8899",
        delivery_enabled=True,
        collection_enabled=True,
        ordering_enabled=True,
        delivery_radius_miles=3.0,
        opening_hours={"monday": {"open": "11:00", "close": "22:00"}, "tuesday": {"open": "11:00", "close": "22:00"}, "wednesday": {"open": "11:00", "close": "22:00"}, "thursday": {"open": "11:00", "close": "22:00"}, "friday": {"open": "11:00", "close": "23:00"}, "saturday": {"open": "11:00", "close": "23:00"}, "sunday": {"open": "11:00", "close": "21:00"}},
        is_active=True
    )
    db.add_all([branch_central, branch_westfield])
    db.flush()

    # Assign branch admins
    db.add_all([
        BranchUser(user_id=central_admin.id, branch_id=branch_central.id),
        BranchUser(user_id=westfield_admin.id, branch_id=branch_westfield.id),
    ])

    # 5. Create Categories
    cat_burgers = Category(name="Burgers", slug="burgers", icon="hamburger", display_order=1)
    cat_chicken = Category(name="Chicken", slug="chicken", icon="drumstick", display_order=2)
    cat_sides = Category(name="Sides", slug="sides", icon="fries", display_order=3)
    cat_extras = Category(name="Extras", slug="extras", icon="plus", display_order=4)
    cat_dips = Category(name="Dips", slug="dips", icon="sauce", display_order=5)
    cat_drinks = Category(name="Drinks", slug="drinks", icon="cup", display_order=6)
    db.add_all([cat_burgers, cat_chicken, cat_sides, cat_extras, cat_dips, cat_drinks])
    db.flush()

    # 6. Create Products
    p1 = Product(
        category_id=cat_burgers.id,
        name="Mc Project",
        sku="BURG001",
        short_description="Double beef, double American cheese, burger sauce, lettuce, onion & gherkins.",
        full_description="A premium double smash beef burger made with 100% British beef, fresh lettuce, sliced tomatoes, onions, pickles, cheddar cheese and our signature Patty sauce served in a toasted brioche bun.",
        image_url="/placeholder-burger.svg",
        base_price=8.95,
        rating=4.7,
        reviews_count=312,
        is_bestseller=True
    )
    p2 = Product(
        category_id=cat_burgers.id,
        name="Outlaw Project",
        sku="BURG002",
        short_description="Smoky BBQ beef patty, smoked bacon, crispy onion rings & melted cheddar.",
        full_description="Juicy beef patty topped with smoked streaky bacon, melted American cheese, beer-battered onion rings and house BBQ sauce.",
        image_url="/placeholder-burger.svg",
        base_price=8.95,
        rating=4.6,
        reviews_count=189,
        is_bestseller=True
    )
    p3 = Product(
        category_id=cat_burgers.id,
        name="Pastrami Burger",
        sku="BURG003",
        short_description="Beef patty loaded with cured pastrami, Swiss cheese & yellow mustard.",
        full_description="Artisanal smash burger topped with sliced cured brisket pastrami, melted Swiss cheese, gherkin relish and spicy mustard.",
        image_url="/placeholder-burger.svg",
        base_price=8.95,
        rating=4.6,
        reviews_count=145,
        is_bestseller=True
    )
    p4 = Product(
        category_id=cat_chicken.id,
        name="Fried Chicken Sando",
        sku="CHIK001",
        short_description="Crispy buttermilk fried chicken breast, spicy mayo & dill pickle slaw.",
        full_description="Hand-breaded buttermilk fried chicken fillet served with chipotle mayo, house pickles and crunchy cabbage slaw in a brioche bun.",
        image_url="/placeholder-burger.svg",
        base_price=8.45,
        rating=4.6,
        reviews_count=210,
        is_bestseller=True
    )
    p5 = Product(
        category_id=cat_burgers.id,
        name="Halloumi Burger",
        sku="BURG004",
        short_description="Grilled halloumi, roasted red pepper, sweet chili jam & rocket.",
        full_description="Thick-cut grilled Cyprus halloumi cheese with fire-roasted peppers, sweet chili relish, fresh rocket and garlic mayo in a brioche bun.",
        image_url="/placeholder-burger.svg",
        base_price=8.45,
        rating=4.5,
        reviews_count=165,
        is_bestseller=True
    )
    p6 = Product(
        category_id=cat_sides.id,
        name="Loaded Fries",
        sku="FRIES002",
        short_description="Fries topped with cheese sauce, crispy bacon bits & jalapeños.",
        full_description="Skin-on fries smothered in warm cheddar cheese sauce, crispy smoked bacon pieces, chopped jalapeños and green onion.",
        image_url="/placeholder-burger.svg",
        base_price=6.45,
        rating=4.5,
        reviews_count=178,
        is_bestseller=True
    )
    p7 = Product(
        category_id=cat_drinks.id,
        name="Coca Cola 330ml",
        sku="DRINK001",
        short_description="Chilled original taste Coca-Cola can.",
        full_description="Classic ice-cold Coca Cola 330ml can.",
        image_url="/placeholder-burger.svg",
        base_price=1.50,
        rating=4.9,
        reviews_count=500,
        is_bestseller=False
    )
    db.add_all([p1, p2, p3, p4, p5, p6, p7])
    db.flush()

    # Product Modifiers (Add-ons)
    db.add_all([
        ProductModifier(product_id=p1.id, name="Extra Beef Patty", price=2.00),
        ProductModifier(product_id=p1.id, name="Bacon", price=1.50),
        ProductModifier(product_id=p1.id, name="Jalapeños", price=0.80),
        ProductModifier(product_id=p1.id, name="Extra Cheese", price=0.80),
        ProductModifier(product_id=p2.id, name="Extra Beef Patty", price=2.00),
        ProductModifier(product_id=p2.id, name="Bacon", price=1.50),
        ProductModifier(product_id=p2.id, name="Jalapeños", price=0.80),
    ])

    # Branch Inventory
    for prod in [p1, p2, p3, p4, p5, p6, p7]:
        db.add(Inventory(branch_id=branch_central.id, product_id=prod.id, stock_quantity=100))
        db.add(Inventory(branch_id=branch_westfield.id, product_id=prod.id, stock_quantity=80))

    # 7. Create Coupons
    db.add_all([
        Coupon(code="WELCOME10", name="Welcome Offer", coupon_type="PERCENTAGE", discount_value=10.0, min_order_value=15.0, usage_limit=1000, used_count=432),
        Coupon(code="BURGER20", name="Burger Bonanza", coupon_type="PERCENTAGE", discount_value=20.0, min_order_value=20.0, usage_limit=500, used_count=278),
        Coupon(code="FREESHIP", name="Free Shipping", coupon_type="FREE_SHIPPING", discount_value=0.0, min_order_value=10.0, usage_limit=9999, used_count=1245),
        Coupon(code="FLAT15", name="Flat 15 Off", coupon_type="FIXED_AMOUNT", discount_value=15.0, min_order_value=50.0, usage_limit=300, used_count=103),
    ])

    # 8. Create Loyalty Rewards
    db.add_all([
        LoyaltyReward(title="Free Fries", description="Get a regular fries absolutely free!", points_required=500, reward_type="FREE_ITEM", product_id=p5.id),
        LoyaltyReward(title="Free Milkshake", description="Get any regular milkshake absolutely free!", points_required=750, reward_type="FREE_ITEM"),
        LoyaltyReward(title="Free Burger", description="Get any classic burger absolutely free!", points_required=1500, reward_type="FREE_ITEM", product_id=p1.id),
    ])

    # 9. Create Sample Orders
    sample_order = Order(
        order_number="#PP1258",
        customer_id=customer.id,
        customer_name="John Smith",
        customer_email="john.smith@email.com",
        customer_phone="+44 7123 456789",
        branch_id=branch_central.id,
        order_type=OrderType.DELIVERY,
        status=OrderStatus.PREPARING,
        delivery_address={
            "address_line1": "123 Baker Street",
            "address_line2": "Near Baker Street Station",
            "city": "London",
            "postcode": "W1U 6EP"
        },
        delivery_instructions="Leave at the door",
        subtotal=14.66,
        delivery_fee=2.49,
        service_fee=0.99,
        discount_amount=0.0,
        vat_amount=2.93,
        total_amount=24.98,
        payment_method="Online (Card)",
        payment_status=PaymentStatus.PAID,
        payment_transaction_id="TXN4789632145",
        points_earned=150
    )
    db.add(sample_order)
    db.flush()

    db.add_all([
        OrderItem(order_id=sample_order.id, product_id=p1.id, product_name="Classic Beef Burger", quantity=1, unit_price=8.99, total_price=8.99, selected_modifiers=[{"name": "No onion"}, {"name": "Extra cheese", "price": 0.80}]),
        OrderItem(order_id=sample_order.id, product_id=p5.id, product_name="French Fries (Regular)", quantity=1, unit_price=2.49, total_price=2.49),
        OrderItem(order_id=sample_order.id, product_id=p7.id, product_name="Coca Cola 500ml", quantity=2, unit_price=1.59, total_price=3.18),
        OrderStatusHistory(order_id=sample_order.id, from_status=OrderStatus.PAID, to_status=OrderStatus.PREPARING, notes="Kitchen accepted order")
    ])

    db.commit()
    db.close()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_db()
