"""Add download statistics to Purchase model

Revision ID: 83f2412ba399
Revises: 7a507b42d89e
Create Date: 2025-06-10 15:49:18.344475

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '83f2412ba399'
down_revision: Union[str, None] = '7a507b42d89e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('purchases', sa.Column('download_count', sa.Integer(), nullable=True))
    op.add_column('purchases', sa.Column('last_download_date', sa.DateTime(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('purchases', 'last_download_date')
    op.drop_column('purchases', 'download_count')
    # ### end Alembic commands ###
