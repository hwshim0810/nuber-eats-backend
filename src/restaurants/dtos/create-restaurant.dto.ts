import { InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Restaurant } from '../entities/restaurant.entity';

// #3.5 Mapped Types 강의참고
// Mapped Type으로 받는 Entitiy가 InputType이 아니라면 아래와 같이 데코레이터 교체가 필요함
// Restaurant entity 참조
@InputType()
export class CreateRestaurantInput extends OmitType(
  Restaurant,
  ['id', 'category', 'owner'],
  InputType,
) {}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {}
