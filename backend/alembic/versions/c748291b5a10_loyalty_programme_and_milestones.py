"""loyalty_programme_and_milestones

Revision ID: c748291b5a10
Revises: ed7049002652
Create Date: 2026-08-25 22:15:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c748291b5a10'
down_revision: Union[str, Sequence[str], None] = 'ed7049002652'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Add new auditable / campaign columns to existing loyalty_transactions table
    op.add_column('loyalty_transactions', sa.Column('campaign_id', sa.String(length=36), nullable=True))
    op.add_column('loyalty_transactions', sa.Column('admin_id', sa.String(length=36), nullable=True))
    op.add_column('loyalty_transactions', sa.Column('admin_email', sa.String(length=255), nullable=True))
    op.add_column('loyalty_transactions', sa.Column('resulting_balance', sa.Integer(), nullable=True))
    op.add_column('loyalty_transactions', sa.Column('metadata_json', sa.JSON(), nullable=True))

    # 2. Create loyalty_program_configs table
    op.create_table(
        'loyalty_program_configs',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('is_enabled', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('earning_rate_pence_per_point', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('points_per_pound_reward', sa.Integer(), nullable=False, server_default='1000'),
        sa.Column('min_redemption_points', sa.Integer(), nullable=False, server_default='4000'),
        sa.Column('redemption_increment_points', sa.Integer(), nullable=False, server_default='1000'),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.Column('updated_by', sa.String(length=255), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # 3. Create loyalty_campaigns table
    op.create_table(
        'loyalty_campaigns',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('campaign_type', sa.String(length=50), nullable=False, server_default='DOUBLE_POINTS'),
        sa.Column('multiplier', sa.Float(), nullable=True, server_default='2.0'),
        sa.Column('bonus_points', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('start_date', sa.DateTime(), nullable=True),
        sa.Column('end_date', sa.DateTime(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('eligible_products', sa.JSON(), nullable=True),
        sa.Column('excluded_products', sa.JSON(), nullable=True),
        sa.Column('eligible_categories', sa.JSON(), nullable=True),
        sa.Column('excluded_categories', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # 4. Create loyalty_milestones table
    op.create_table(
        'loyalty_milestones',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('points_required', sa.Integer(), nullable=False, server_default='4000'),
        sa.Column('reward_type', sa.String(length=50), nullable=False, server_default='REWARD_DISCOUNT'),
        sa.Column('reward_value', sa.Float(), nullable=True, server_default='4.0'),
        sa.Column('description', sa.String(length=255), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('start_date', sa.DateTime(), nullable=True),
        sa.Column('end_date', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    op.drop_table('loyalty_milestones')
    op.drop_table('loyalty_campaigns')
    op.drop_table('loyalty_program_configs')
    op.drop_column('loyalty_transactions', 'metadata_json')
    op.drop_column('loyalty_transactions', 'resulting_balance')
    op.drop_column('loyalty_transactions', 'admin_email')
    op.drop_column('loyalty_transactions', 'admin_id')
    op.drop_column('loyalty_transactions', 'campaign_id')
