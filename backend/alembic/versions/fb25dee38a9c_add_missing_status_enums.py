"""add_missing_status_enums

Revision ID: fb25dee38a9c
Revises: 5e050f9920a7
Create Date: 2026-09-04 04:50:03.425266

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fb25dee38a9c'
down_revision: Union[str, Sequence[str], None] = '5e050f9920a7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    with op.get_context().autocommit_block():
        op.execute("ALTER TYPE statusenum ADD VALUE IF NOT EXISTS 'PRIORITIZED'")
        op.execute("ALTER TYPE statusenum ADD VALUE IF NOT EXISTS 'MATCHED'")
        op.execute("ALTER TYPE statusenum ADD VALUE IF NOT EXISTS 'RECOMMENDED'")


def downgrade() -> None:
    """Downgrade schema."""
    pass
